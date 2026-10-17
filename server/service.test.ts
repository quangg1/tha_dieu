import { beforeAll, describe, expect, it } from 'vitest';
import { pglite, type Db } from './db.js';
import type { Referee } from './referee.js';
import * as S from './service.js';
import { soft } from '../shared/normalize.js';
import { setWikiFetch } from './wikidata.js';

let db: Db;
const day = S.vnToday();
const calls: string[] = [];
const referee: Referee = async (_p, _n, input) => {
  calls.push(input);
  if (/chim ngũ sắc/i.test(input)) return { valid: true, canonical: 'Chim ngũ sắc', reason: 'Có thật.' };
  return { valid: false, canonical: '', reason: 'Không phải tên một loài chim.' };
};

beforeAll(async () => {
  setWikiFetch(async () => new Response('', { status: 503 }));
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

  it('mixes categories and does not repeat recent questions', async () => {
    const { BOOK_BY_ID } = await import('../shared/book/questions.js');
    const days = ['2031-01-01', '2031-01-02', '2031-01-03', '2031-01-04'];
    const sets = [];
    for (const d of days) sets.push(await S.dailySet(db, d));
    for (const set of sets) {
      const cats = set.map((id) => BOOK_BY_ID.get(id)!.category);
      expect(new Set(cats).size).toBe(7);
    }
    const all = sets.flat();
    expect(new Set(all).size).toBe(all.length);
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
    expect(r.status).toBe('landed');
    expect(r.tier).toBe(0);
    expect(r.points).toBe(10);
    expect(r.share).toBeNull();
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
    expect(bad.status).toBe('retry');
    await S.startTurn(db, { playerId: p, day, mode: 'night', questionId: qid });
    const good = await S.answer(db, { playerId: p, day, mode: 'night', questionId: qid, input: 'chim ngũ sắc' }, referee);
    expect(good.status).toBe('landed');
    expect(good.judged).toBe(true);
    expect(good.display).toBe('Chim ngũ sắc');
    expect(good.tier).toBe(4);
    const n = calls.length;
    await S.startTurn(db, { playerId: p, day, mode: 'night', questionId: qid });
    const again = await S.answer(db, { playerId: p, day, mode: 'night', questionId: qid, input: 'chim lửa' }, referee);
    expect(again.status).toBe('retry');
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
    expect(r.status).toBe('late');
  });
});

describe('one answer per prompt', () => {
  it('a near miss asks for confirmation without using up the prompt', async () => {
    const p = 'player_test_0007';
    await S.startTurn(db, { playerId: p, day, mode: 'night', questionId: 'nha-khoa-hoc' });
    const c = await S.answer(db, { playerId: p, day, mode: 'night', questionId: 'nha-khoa-hoc', input: 'einstien' }, referee);
    expect(c.status).toBe('confirm');
    expect(c.suggestion).toBe('Albert Einstein');
    const ok = await S.answer(db, { playerId: p, day, mode: 'night', questionId: 'nha-khoa-hoc', input: c.suggestion! }, referee);
    expect(ok.status).toBe('landed');
  });
  it('an unknown answer asks for another try and keeps the prompt open', async () => {
    const p = 'player_test_0008';
    await S.startTurn(db, { playerId: p, day, mode: 'night', questionId: 'loai-chim' });
    const r = await S.answer(db, { playerId: p, day, mode: 'night', questionId: 'loai-chim', input: 'xe đạp' }, referee);
    expect(r.status).toBe('retry');
    const ok = await S.answer(db, { playerId: p, day, mode: 'night', questionId: 'loai-chim', input: 'đại bàng' }, referee);
    expect(ok.status).toBe('landed');
    expect(ok.crowd?.top.length).toBeGreaterThan(0);
    await expect(S.answer(db, { playerId: p, day, mode: 'night', questionId: 'loai-chim', input: 'cú mèo' }, referee)).rejects.toThrow();
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

describe('Khôn lỏi', () => {
  const q = { krillKey: 'krill', traps: new Set(['tesla']) };
  it('marks hand-picked traps until the crowd proves them rare', () => {
    expect(S.tierFor(q, 'tesla', 2, 0, 0)).toBe(6);
    expect(S.tierFor(q, 'tesla', 2, 1, 500)).toBe(4);
  });
  it('finds answers the book thought rare but many players give', () => {
    expect(S.tierFor(q, 'other', 3, 60, 400)).toBe(6);
    expect(S.tierFor(q, 'common', 0, 60, 400)).toBe(0);
    expect(S.tierFor(q, 'other', 3, 0, 10)).toBe(4);
  });
  it('keeps the hidden answer hidden while few reach it, and drops it once it leaks', () => {
    const q = { krillKey: 'tesla', traps: new Set(['tesla']) };
    expect(S.tierFor(q, 'tesla', 4, 0, 10)).toBe(5);
    expect(S.tierFor(q, 'tesla', 4, 4, 400)).toBe(5);
    expect(S.tierFor(q, 'tesla', 4, 300, 400)).toBe(6);
    expect(S.tierFor(q, 'tesla', 4, 12, 400)).not.toBe(5);
  });
  it('lands a trap from the book in play', async () => {
    const p = 'player_test_0010';
    await S.startTurn(db, { playerId: p, day, mode: 'night', questionId: 'nha-khoa-hoc' });
    const r = await S.answer(db, { playerId: p, day, mode: 'night', questionId: 'nha-khoa-hoc', input: 'Tesla' }, referee);
    expect(r.status).toBe('landed');
    expect(r.tier).toBe(6);
    expect(r.points).toBe(15);
  });
});

describe('vague answers', () => {
  it('asks for something specific without using up the prompt', async () => {
    const p = 'player_test_0009';
    await S.startTurn(db, { playerId: p, day, mode: 'night', questionId: 'loai-chim' });
    const r = await S.answer(db, { playerId: p, day, mode: 'night', questionId: 'loai-chim', input: 'chim' }, referee);
    expect(r.status).toBe('vague');
    const ok = await S.answer(db, { playerId: p, day, mode: 'night', questionId: 'loai-chim', input: 'chim sẻ' }, referee);
    expect(ok.status).toBe('landed');
  });
});

describe('admin', () => {
  it('rejecting an answer removes it from matching', async () => {
    const key = soft('Chim ngũ sắc');
    expect((await S.loadQuestion(db, 'loai-chim')).answers.has(key)).toBe(true);
    await S.review(db, { questionId: 'loai-chim', key, decision: 'reject' });
    const q = await S.loadQuestion(db, 'loai-chim');
    expect(q.answers.has(key)).toBe(false);
  });
});

describe('new answers without a referee', () => {
  it('lets an unknown answer stand as a new one, and the village head can accept it', async () => {
    const { nullReferee } = await import('./referee.js');
    const qid = 'loai-hoa';
    await S.startTurn(db, { playerId: 'player_test_0005', day, mode: 'night', questionId: qid });
    const r = await S.answer(db, { playerId: 'player_test_0005', day, mode: 'night', questionId: qid, input: 'Hoa bảy màu thần kỳ' }, nullReferee);
    expect(r.status).toBe('landed');
    expect(r.pending).toBe(true);
    expect(r.tier).toBe(2);
    const item = (await S.submissions(db)).find((x) => x.question_id === qid && x.input_key === soft('Hoa bảy màu thần kỳ'))!;
    expect(item.n).toBe(1);
    await S.decideSubmission(db, { questionId: qid, inputKey: item.input_key, decision: 'accept', display: 'Hoa bảy màu thần kỳ', tier: 3 });
    await S.startTurn(db, { playerId: 'player_test_0005b', day, mode: 'night', questionId: qid });
    const ok = await S.answer(db, { playerId: 'player_test_0005b', day, mode: 'night', questionId: qid, input: 'bảy màu thần kỳ' }, nullReferee);
    expect(ok.status).toBe('landed');
    expect(ok.pending).toBeFalsy();
  });

  it('a dismissed new answer is refused afterwards', async () => {
    const { nullReferee } = await import('./referee.js');
    await S.startTurn(db, { playerId: 'player_test_0006', day, mode: 'night', questionId: 'loai-rau' });
    const first = await S.answer(db, { playerId: 'player_test_0006', day, mode: 'night', questionId: 'loai-rau', input: 'rau gì đó' }, nullReferee);
    expect(first.pending).toBe(true);
    await S.decideSubmission(db, { questionId: 'loai-rau', inputKey: soft('rau gì đó'), decision: 'dismiss' });
    await S.startTurn(db, { playerId: 'player_test_0006b', day, mode: 'night', questionId: 'loai-rau' });
    const r = await S.answer(db, { playerId: 'player_test_0006b', day, mode: 'night', questionId: 'loai-rau', input: 'rau gì đó' }, nullReferee);
    expect(r.status).toBe('retry');
    expect(r.reason).toMatch(/không công nhận/);
  });

  it('three networks giving the same new answer confirm it', async () => {
    const { nullReferee } = await import('./referee.js');
    const qid = 'trai-cay';
    const ask = async (p: string, net: string) => {
      await S.startTurn(db, { playerId: p, day, mode: 'night', questionId: qid });
      return S.answer(db, { playerId: p, day, mode: 'night', questionId: qid, input: 'Quả thanh long ruột tím', net }, nullReferee);
    };
    expect((await ask('vote_p1', 'net-a')).pending).toBe(true);
    expect((await ask('vote_p2', 'net-a')).pending).toBe(true);
    expect((await ask('vote_p3', 'net-b')).pending).toBe(true);
    const third = await ask('vote_p4', 'net-c');
    expect(third.status).toBe('landed');
    expect(third.pending).toBe(false);
    expect((await ask('vote_p5', 'net-d')).pending).toBe(false);
  });

  it('allows two new answers a run, then asks for a known one; nonsense is refused', async () => {
    const { nullReferee } = await import('./referee.js');
    const p = 'limit_player';
    const qs = ['loai-ca', 'con-trung', 'nhac-cu'];
    const out = [];
    for (const [i, qid] of qs.entries()) {
      await S.startTurn(db, { playerId: p, day, mode: 'night', questionId: qid });
      out.push(await S.answer(db, { playerId: p, day, mode: 'night', questionId: qid, input: `Tên lạ thứ ${['một', 'hai', 'ba'][i]}` }, nullReferee));
    }
    expect(out.map((r) => r.status)).toEqual(['landed', 'landed', 'retry']);
    await S.startTurn(db, { playerId: 'junk_player', day, mode: 'night', questionId: 'the-thao' });
    const junk = await S.answer(db, { playerId: 'junk_player', day, mode: 'night', questionId: 'the-thao', input: 'aaaaaaa' }, nullReferee);
    expect(junk.status).toBe('retry');
  });

  it('refuses keyboard noise, but takes a real foreign name Wikidata knows', async () => {
    const { nullReferee } = await import('./referee.js');
    await S.startTurn(db, { playerId: 'noise_player', day, mode: 'night', questionId: 'the-thao' });
    const noise = await S.answer(db, { playerId: 'noise_player', day, mode: 'night', questionId: 'the-thao', input: 'abcxyz lạ' }, nullReferee);
    expect(noise.status).toBe('retry');
    setWikiFetch(async (url) => {
      const u = String(url);
      if (u.includes('wbsearchentities') && u.includes('Zorbing')) return new Response(JSON.stringify({ search: [{ id: 'Q1', label: 'Zorbing', match: { text: 'Zorbing' } }] }));
      return new Response(JSON.stringify({ search: [] }));
    });
    try {
      await S.startTurn(db, { playerId: 'noise_player2', day, mode: 'night', questionId: 'the-thao' });
      const real = await S.answer(db, { playerId: 'noise_player2', day, mode: 'night', questionId: 'the-thao', input: 'Zorbing' }, nullReferee);
      expect(real.status).toBe('landed');
      expect(real.pending).toBe(true);
    } finally {
      setWikiFetch(async () => new Response('', { status: 503 }));
    }
  });

  it('accepts an answer Wikidata confirms is of the right kind', async () => {
    const { nullReferee } = await import('./referee.js');
    setWikiFetch(async (url) => {
      const u = String(url);
      if (u.includes('wbsearchentities')) return new Response(JSON.stringify({ search: [{ id: 'Q999', label: 'sáo nâu đỏ', match: { language: 'vi', text: 'sáo nâu đỏ' } }] }));
      return new Response(JSON.stringify({ results: { bindings: [{ x: { value: 'http://www.wikidata.org/entity/Q999' } }] } }));
    });
    try {
      await S.startTurn(db, { playerId: 'wiki_player', day, mode: 'night', questionId: 'loai-chim' });
      const r = await S.answer(db, { playerId: 'wiki_player', day, mode: 'night', questionId: 'loai-chim', input: 'chim sáo nâu đỏ' }, nullReferee);
      expect(r.status).toBe('landed');
      expect(r.pending).toBeFalsy();
      expect(r.display).toBe('Sáo nâu đỏ');
    } finally {
      setWikiFetch(async () => new Response('', { status: 503 }));
    }
  });
});

describe('settling the day', () => {
  it('scores early and late players with the same crowd data, and keeps device replays off the board', async () => {
    const d = '2031-02-01';
    const [qid] = await S.dailySet(db, d);
    const q = await S.loadQuestion(db, qid);
    const rare = [...q.answers.entries()].find(([k, a]) => a.prior === 3 && k !== q.krillKey && !q.traps.has(k))!;
    const players = Array.from({ length: 6 }, (_, i) => `settle_player_${i}`);
    const firstTier: number[] = [];
    for (const p of players) {
      await S.startTurn(db, { playerId: p, day: d, mode: 'daily', questionId: qid });
      const r = await S.answer(db, { playerId: p, day: d, mode: 'daily', questionId: qid, input: rare[1].display }, referee);
      firstTier.push(r.tier!);
    }
    const set = await S.dailySet(db, d);
    for (const id of set.slice(1)) {
      await S.startTurn(db, { playerId: players[0], day: d, mode: 'daily', questionId: id });
      await S.miss(db, { playerId: players[0], day: d, mode: 'daily', questionId: id });
    }
    const a = await S.finish(db, { playerId: players[0], day: d, mode: 'daily', dev: 'dev-a', since: '2031-01-01' });
    const b = await S.finish(db, { playerId: players[5], day: d, mode: 'daily', dev: 'dev-b', since: '2031-01-01' });
    expect(a.score).toBe(b.score);
    expect(b.reveal).toBeUndefined();
    expect(a.reveal?.[0].krill).toBe(q.answers.get(q.krillKey)!.display);
    expect(a.reveal?.[0].mine).toBe(rare[1].display);
    // Same device, a player id first seen today: a replay in a private tab.
    const c = await S.finish(db, { playerId: players[3], day: d, mode: 'daily', dev: 'dev-a', since: d });
    expect(c.replay).toBe(true);
    const board = await S.board(db, d, 'daily');
    expect(board.players).toBe(2);
  });
});

describe('launch guards', () => {
  it('limits a counter per window', async () => {
    expect(await S.hit(db, 'test:k', 'w1', 2)).toBe(true);
    expect(await S.hit(db, 'test:k', 'w1', 2)).toBe(true);
    expect(await S.hit(db, 'test:k', 'w1', 2)).toBe(false);
    expect(await S.hit(db, 'test:k', 'w2', 2)).toBe(true);
  });

  it('stops counting answers from a network after its first sixty players', async () => {
    const d = '2031-03-01';
    const [qid] = await S.dailySet(db, d);
    const q = await S.loadQuestion(db, qid);
    const [key, entry] = [...q.answers.entries()].find(([, v]) => v.prior === 1)!;
    const count = async () => (await db.query<{ n: number }>(`select n from counts where question_id=$1 and answer_key=$2`, [qid, key]))[0]?.n ?? 0;
    const before = await count();
    for (let i = 0; i < 62; i++) {
      const p = `net_player_${String(i).padStart(3, '0')}`;
      await S.startTurn(db, { playerId: p, day: d, mode: 'daily', questionId: qid });
      const r = await S.answer(db, { playerId: p, day: d, mode: 'daily', questionId: qid, input: entry.display, net: 'same-cafe' }, referee);
      expect(r.status).toBe('landed');
    }
    expect((await count()) - before).toBe(60);
  });

  it('collects reports and events', async () => {
    const [qid] = await S.dailySet(db, day);
    await S.report(db, { questionId: qid, input: 'Gì đó lạ', kind: 'rejected' });
    await S.report(db, { questionId: qid, input: 'gi do la', kind: 'rejected' });
    const list = await S.reports(db);
    expect(list.find((r) => r.question_id === qid)?.n).toBe(2);
    await S.logEvent(db, { day, name: 'open', playerId: 'player_test_0001' });
    await expect(S.logEvent(db, { day, name: 'hack', playerId: 'x' })).rejects.toThrow();
    const ins = await S.insights(db);
    expect(ins.funnel.some((f) => f.name === 'open')).toBe(true);
  });
});

describe('day by day', () => {
  it('picks a new hidden answer when a prompt comes back, never one shown before', async () => {
    const d1 = '2032-05-01';
    const d2 = '2032-07-01';
    // A prompt no earlier test day has asked, so its first hidden answer is the book's.
    const used = new Set((await db.query<{ ids: string[] }>(`select question_ids as ids from daily_sets`)).flatMap((r) => r.ids));
    const qid = (await db.query<{ id: string }>(`select id from questions where active order by id`)).map((r) => r.id).find((id) => !used.has(id))!;
    await db.query(`insert into daily_sets (day, question_ids) values ($1::date, $2) on conflict do nothing`, [d1, [qid]]);
    const q = await S.loadQuestion(db, qid);
    expect(await S.krillFor(db, d1, q)).toBe(q.krillKey);
    // The same prompt asked again later.
    await db.query(`insert into daily_sets (day, question_ids) values ($1::date, $2) on conflict do nothing`, [d2, [qid]]);
    const k2 = await S.krillFor(db, d2, q);
    expect(k2).not.toBe(q.krillKey);
    expect(q.answers.get(k2)!.prior).toBeGreaterThanOrEqual(4);
    const dq = await S.dayQuestion(db, d2, qid);
    expect(S.tierFor(dq, k2, 4, 0, 5)).toBe(5);
    expect(S.tierFor(dq, q.krillKey, 4, 0, 5)).not.toBe(5);
  });

  it('measures rarity among the day\'s players, with earlier days as the starting guess', async () => {
    // An answer the book thought rare but that earlier days gave everywhere is not rare today either.
    expect([0, 1, 6]).toContain(S.tierFor({ krillKey: 'zz', traps: new Set() }, 'a', 4, 1, 40, 0.9));
    // Without history the book's guess is used.
    expect(S.tierFor({ krillKey: 'zz', traps: new Set() }, 'a', 4, 0, 40)).toBe(4);
  });
});

describe('a slow referee', () => {
  const slow = (v: { valid: boolean; canonical: string; reason: string }): Referee => () => new Promise((r) => setTimeout(() => r(v), 500));
  it('lets the answer land at once, then settles it in the background', async () => {
    process.env.REFEREE_INLINE_MS = '40';
    try {
      const qid = 'loai-hoa';
      await S.startTurn(db, { playerId: 'slow_ok', day, mode: 'night', questionId: qid });
      const r = await S.answer(db, { playerId: 'slow_ok', day, mode: 'night', questionId: qid, input: 'Hoa bướm đêm Sơn La' }, slow({ valid: true, canonical: 'Hoa bướm đêm Sơn La', reason: 'Có thật.' }));
      expect(r).toMatchObject({ status: 'landed', pending: true });
      await S.settleAll();
      const st = await S.newAnswerStatus(db, { playerId: 'slow_ok', day, mode: 'night', questionIds: [qid] });
      expect(st.answers[0].state).toBe('approved');

      await S.startTurn(db, { playerId: 'slow_bad', day, mode: 'night', questionId: 'loai-rau' });
      const bad = await S.answer(db, { playerId: 'slow_bad', day, mode: 'night', questionId: 'loai-rau', input: 'Rau bịa đặt' }, slow({ valid: false, canonical: '', reason: 'Không có loại rau này.' }));
      expect(bad.status).toBe('landed');
      await S.settleAll();
      const st2 = await S.newAnswerStatus(db, { playerId: 'slow_bad', day, mode: 'night', questionIds: ['loai-rau'] });
      expect(st2.answers[0].state).toBe('rejected');
      // The next player who types it is refused at once.
      await S.startTurn(db, { playerId: 'slow_bad2', day, mode: 'night', questionId: 'loai-rau' });
      const again = await S.answer(db, { playerId: 'slow_bad2', day, mode: 'night', questionId: 'loai-rau', input: 'Rau bịa đặt' }, slow({ valid: false, canonical: '', reason: 'x' }));
      expect(again.status).toBe('retry');

      // A misspelling of a book answer is folded into it.
      await S.startTurn(db, { playerId: 'slow_fold', day, mode: 'night', questionId: 'trai-cay' });
      const fold = await S.answer(db, { playerId: 'slow_fold', day, mode: 'night', questionId: 'trai-cay', input: 'Trái xoài cát lộc' }, slow({ valid: true, canonical: 'Xoài', reason: 'Là xoài.' }));
      expect(fold.pending).toBe(true);
      await S.settleAll();
      const st3 = await S.newAnswerStatus(db, { playerId: 'slow_fold', day, mode: 'night', questionIds: ['trai-cay'] });
      expect(st3.answers[0]).toMatchObject({ state: 'approved', display: 'Xoài' });
    } finally {
      delete process.env.REFEREE_INLINE_MS;
    }
  });
});

describe('the night shift', () => {
  it('judges waiting answers and fills tomorrow from the AI', async () => {
    const { nullReferee } = await import('./referee.js');
    await S.startTurn(db, { playerId: 'night_p', day, mode: 'night', questionId: 'loai-ca' });
    const r = await S.answer(db, { playerId: 'night_p', day, mode: 'night', questionId: 'loai-ca', input: 'Cá lạ đêm khuya' }, nullReferee);
    expect(r.pending).toBe(true);
    const suggested: string[] = [];
    const report = await S.nightShift(db, {
      async judgeMany(_p, _n, inputs) {
        return inputs.map((x) => (/đêm khuya/.test(x) ? { valid: false, canonical: '', reason: 'Bịa.' } : { valid: true, canonical: x, reason: 'Đúng.' }));
      },
      async suggest(prompt) {
        const name = `Đáp án mới cho ${prompt.slice(0, 12)}`;
        suggested.push(name);
        return [{ name, tier: 2 }];
      },
    });
    expect(report.rejected).toBeGreaterThanOrEqual(1);
    expect(report.questions).toHaveLength(7);
    expect(report.added).toBe(7);
    const st = await S.newAnswerStatus(db, { playerId: 'night_p', day, mode: 'night', questionIds: ['loai-ca'] });
    expect(st.answers[0].state).toBe('rejected');
    const q = await S.loadQuestion(db, report.questions[0]);
    expect([...q.answers.values()].some((a) => a.display === suggested[0] || suggested.includes(a.display))).toBe(true);
  });
});
