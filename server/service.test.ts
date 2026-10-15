import { beforeAll, describe, expect, it } from 'vitest';
import { pglite, type Db } from './db.js';
import type { Referee } from './referee.js';
import * as S from './service.js';

let db: Db;
const day = S.vnToday();
const calls: string[] = [];
const referee: Referee = async (_p, _n, input) => {
  calls.push(input);
  if (/chim ngũ sắc/i.test(input)) return { valid: true, canonical: 'Chim ngũ sắc', reason: 'Có thật.' };
  return { valid: false, canonical: '', reason: 'Không phải tên một loài chim.' };
};

beforeAll(async () => {
  db = await pglite();
  const r = await S.setup(db);
  expect(r.questions).toBeGreaterThan(30);
  await S.setup(db); // idempotent
}, 60_000);

describe('daily set', () => {
  it('is stable for a day and has seven questions', async () => {
    const a = await S.dailySet(db, day);
    const b = await S.dailySet(db, day);
    expect(a).toHaveLength(7);
    expect(b).toEqual(a);
  });
});

describe('answering', () => {
  const player = 'player_test_0001';
  it('scores a known answer, counts it and refuses a second answer', async () => {
    const [qid] = await S.dailySet(db, day);
    await S.startTurn(db, { playerId: player, day, mode: 'daily', questionId: qid });
    const q = await S.loadQuestion(db, qid);
    const common = [...q.answers.entries()].find(([, v]) => v.prior === 0)!;
    const r = await S.answer(db, { playerId: player, day, mode: 'daily', questionId: qid, input: common[1].display }, referee);
    expect(r.ok).toBe(true);
    expect(r.tier).toBe(0);
    expect(r.points).toBe(10);
    expect(r.crowd?.total).toBe(1);
    await expect(S.answer(db, { playerId: player, day, mode: 'daily', questionId: qid, input: common[1].display }, referee)).rejects.toThrow();
  });

  it('rejects answers to questions outside today', async () => {
    const set = await S.dailySet(db, day);
    const other = (await db.query<{ id: string }>(`select id from questions where not (id = any($1::text[])) limit 1`, [set]))[0].id;
    await expect(S.startTurn(db, { playerId: player, day, mode: 'daily', questionId: other })).rejects.toThrow();
  });

  it('asks the referee once for an unknown answer, then remembers the verdict', async () => {
    const p = 'player_test_0002';
    const qid = 'loai-chim';
    await S.startTurn(db, { playerId: p, day, mode: 'night', questionId: qid });
    const bad = await S.answer(db, { playerId: p, day, mode: 'night', questionId: qid, input: 'chim lửa' }, referee);
    expect(bad.ok).toBe(false);
    const good = await S.answer(db, { playerId: p, day, mode: 'night', questionId: qid, input: 'chim ngũ sắc' }, referee);
    expect(good.ok).toBe(true);
    expect(good.judged).toBe(true);
    expect(good.display).toBe('Chim ngũ sắc');
    expect(good.tier).toBe(4);
    const n = calls.length;
    await S.startTurn(db, { playerId: p, day, mode: 'night', questionId: qid });
    const again = await S.answer(db, { playerId: p, day, mode: 'night', questionId: qid, input: 'chim lửa' }, referee);
    expect(again.ok).toBe(false);
    expect(calls.length).toBe(n);
    const pend = await S.pending(db);
    expect(pend.some((x) => x.display === 'Chim ngũ sắc')).toBe(true);
  });

  it('gives the hidden answer 100 points and builds a streak', async () => {
    const p = 'player_test_0003';
    await S.startTurn(db, { playerId: p, day, mode: 'night', questionId: 'nhac-cu' });
    const a = await S.answer(db, { playerId: p, day, mode: 'night', questionId: 'nhac-cu', input: 'dan moi' }, referee);
    expect(a.tier).toBe(5);
    expect(a.points).toBe(100);
    await S.startTurn(db, { playerId: p, day, mode: 'night', questionId: 'loai-hoa' });
    const b = await S.answer(db, { playerId: p, day, mode: 'night', questionId: 'loai-hoa', input: 'xuyen chi' }, referee);
    expect(b.bonus).toBe(5);
  });

  it('marks late daily answers as missed', async () => {
    const p = 'player_test_0004';
    const [, qid] = await S.dailySet(db, day);
    await S.startTurn(db, { playerId: p, day, mode: 'daily', questionId: qid });
    const later = new Date(Date.now() + 120_000);
    const r = await S.answer(db, { playerId: p, day, mode: 'daily', questionId: qid, input: 'abc' }, referee, later);
    expect(r.late).toBe(true);
  });
});

describe('runs', () => {
  it('computes altitude on the server and ranks players', async () => {
    const r1 = await S.finish(db, { playerId: 'player_test_0001', day, mode: 'daily', name: 'Lan' });
    expect(r1.score).toBe(10);
    expect(r1.altitude).toBeCloseTo(Math.pow(10, 10 / 65));
    expect(r1.grid).toMatch(/^0x{6}$/);
    const b = await S.board(db, day, 'daily', 'player_test_0001');
    expect(b.rows[0].me).toBe(true);
    expect(b.rows[0].name).toBe('Lan');
  });
});

describe('admin', () => {
  it('rejecting an answer removes it from matching', async () => {
    await S.review(db, { questionId: 'loai-chim', key: 'chimngusac', decision: 'reject' });
    const q = await S.loadQuestion(db, 'loai-chim');
    expect(q.answers.has('chimngusac')).toBe(false);
  });
});

describe('review queue without a referee', () => {
  it('logs unknown answers, and an accepted one scores from then on', async () => {
    const { nullReferee } = await import('./referee.js');
    const p = 'player_test_0005';
    const qid = 'loai-hoa';
    await S.startTurn(db, { playerId: p, day, mode: 'night', questionId: qid });
    const r = await S.answer(db, { playerId: p, day, mode: 'night', questionId: qid, input: 'Hoa ngũ sắc' }, nullReferee);
    expect(r.ok).toBe(false);
    expect(r.reason).toMatch(/trưởng làng/);
    await S.answer(db, { playerId: p, day, mode: 'night', questionId: qid, input: 'hoa ngu sac' }, nullReferee);
    const queue = await S.submissions(db);
    const item = queue.find((x) => x.question_id === qid && x.input_key === 'hoangusac')!;
    expect(item.n).toBe(2);
    await S.decideSubmission(db, { questionId: qid, inputKey: item.input_key, decision: 'accept', display: 'Hoa ngũ sắc', tier: 3 });
    const ok = await S.answer(db, { playerId: p, day, mode: 'night', questionId: qid, input: 'ngũ sắc' }, nullReferee);
    expect(ok.ok).toBe(true);
    expect(ok.tier).toBe(3);
    expect((await S.submissions(db)).some((x) => x.input_key === 'hoangusac')).toBe(false);
  });

  it('a dismissed answer is refused without queuing again', async () => {
    const { nullReferee } = await import('./referee.js');
    const p = 'player_test_0006';
    await S.startTurn(db, { playerId: p, day, mode: 'night', questionId: 'loai-rau' });
    await S.answer(db, { playerId: p, day, mode: 'night', questionId: 'loai-rau', input: 'rau gì đó' }, nullReferee);
    await S.decideSubmission(db, { questionId: 'loai-rau', inputKey: 'raugido', decision: 'dismiss' });
    const r = await S.answer(db, { playerId: p, day, mode: 'night', questionId: 'loai-rau', input: 'rau gì đó' }, nullReferee);
    expect(r.reason).toMatch(/không công nhận/);
  });
});
