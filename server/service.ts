import { BANK } from '../shared/bank.js';
import { Matcher, parseRaw } from '../shared/match.js';
import { norm } from '../shared/normalize.js';
import {
  QUESTION_SECONDS,
  TIERS,
  altitudeFor,
  streakBonus,
  tierFromCounts,
  type TierIndex,
} from '../shared/scoring.js';
import type { Db } from './db.js';
import { nullReferee, type Referee } from './referee.js';
import { SCHEMA } from './schema.js';

export class GameError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export const DAILY_COUNT = 7;
/** Seconds a daily turn may stay open: the wind, one "Gọi gió", the referee's think time and network slack. */
const TURN_GRACE_SECONDS = QUESTION_SECONDS + 10 + 15;
const REFEREE_CALLS_PER_DAY = 25;

/* ------------------------------------------------------------------ setup */

/** Creates tables and loads the built-in question bank. Safe to run again: existing answers and counts are kept. */
export async function setup(db: Db) {
  await db.exec(SCHEMA);
  for (const raw of BANK) {
    const q = parseRaw(raw);
    await db.query(
      `insert into questions (id, category, prompt, note, strip, krill_key) values ($1,$2,$3,$4,$5,$6)
       on conflict (id) do update set category=excluded.category, prompt=excluded.prompt, note=excluded.note, strip=excluded.strip, krill_key=excluded.krill_key`,
      [q.id, q.category, q.prompt, q.note ?? null, q.strip, q.krillKey],
    );
    const keys = q.answers.map((a) => a.key);
    await db.query(
      `insert into answers (question_id, key, display, prior_tier)
       select $1, k, d, t from unnest($2::text[], $3::text[], $4::int[]) as x(k, d, t)
       on conflict (question_id, key) do nothing`,
      [q.id, keys, q.answers.map((a) => a.display), q.answers.map((a) => a.priorTier)],
    );
    const aliasRows = q.answers.flatMap((a) => a.aliases.map((al) => [norm(al), a.key] as const)).filter(([al]) => al);
    await db.query(
      `insert into aliases (question_id, alias, key)
       select $1, a, k from unnest($2::text[], $3::text[]) as x(a, k)
       on conflict (question_id, alias) do nothing`,
      [q.id, aliasRows.map((r) => r[0]), aliasRows.map((r) => r[1])],
    );
  }
  const [{ n }] = await db.query<{ n: number }>(`select count(*)::int as n from questions where active`);
  return { questions: n };
}

/* ------------------------------------------------------------------ days */

/** Today's date in Vietnam, YYYY-MM-DD. Every player shares the same daily set. */
export function vnToday(now = new Date()): string {
  return new Date(now.getTime() + 7 * 3600_000).toISOString().slice(0, 10);
}

function seeded(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

/** The day's question ids, created on first request from the questions not used in the previous few days. */
export async function dailySet(db: Db, day: string): Promise<string[]> {
  const found = await db.query<{ question_ids: string[] }>(`select question_ids from daily_sets where day=$1::date`, [day]);
  if (found.length) return found[0].question_ids;
  const ids = (await db.query<{ id: string }>(`select id from questions where active order by id`)).map((r) => r.id);
  const recent = new Set(
    (
      await db.query<{ question_ids: string[] }>(
        `select question_ids from daily_sets where day < $1::date and day >= $1::date - 3 order by day desc`,
        [day],
      )
    ).flatMap((r) => r.question_ids),
  );
  const rnd = seeded('tha-dieu-' + day);
  const shuffled = ids
    .map((id) => ({ id, r: rnd() + (recent.has(id) ? 1 : 0) }))
    .sort((a, b) => a.r - b.r)
    .map((x) => x.id);
  const pick = shuffled.slice(0, DAILY_COUNT);
  await db.query(`insert into daily_sets (day, question_ids) values ($1::date, $2) on conflict (day) do nothing`, [day, pick]);
  const again = await db.query<{ question_ids: string[] }>(`select question_ids from daily_sets where day=$1::date`, [day]);
  return again[0].question_ids;
}

/* ------------------------------------------------------------------ questions */

export interface LoadedQuestion {
  id: string;
  category: string;
  prompt: string;
  note: string | null;
  krillKey: string;
  strip: string[];
  answers: Map<string, { display: string; prior: number; status: string }>;
  matcher: Matcher;
}

const cache = new Map<string, { at: number; q: LoadedQuestion }>();
const CACHE_MS = 60_000;

export function forgetQuestion(id: string) {
  cache.delete(id);
}

export async function loadQuestion(db: Db, id: string): Promise<LoadedQuestion> {
  const hit = cache.get(id);
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.q;
  const rows = await db.query<{ id: string; category: string; prompt: string; note: string | null; krill_key: string; strip: string[] }>(
    `select id, category, prompt, note, krill_key, strip from questions where id=$1`,
    [id],
  );
  if (!rows.length) throw new GameError(404, 'Không tìm thấy câu hỏi.');
  const r = rows[0];
  const ans = await db.query<{ key: string; display: string; prior_tier: number; status: string }>(
    `select key, display, prior_tier, status from answers where question_id=$1 and status <> 'rejected'`,
    [id],
  );
  const al = await db.query<{ alias: string; key: string }>(`select alias, key from aliases where question_id=$1`, [id]);
  const answers = new Map(ans.map((a) => [a.key, { display: a.display, prior: a.prior_tier, status: a.status }]));
  const byKey = new Map<string, string[]>();
  for (const a of al) if (answers.has(a.key)) byKey.set(a.key, [...(byKey.get(a.key) ?? []), a.alias]);
  const matcher = new Matcher(
    r.strip,
    [...answers.keys()].map((key) => ({ key, aliases: byKey.get(key) ?? [] })),
  );
  const q: LoadedQuestion = {
    id: r.id,
    category: r.category,
    prompt: r.prompt,
    note: r.note,
    krillKey: r.krill_key,
    strip: r.strip,
    answers,
    matcher,
  };
  cache.set(id, { at: Date.now(), q });
  return q;
}

export function publicQuestion(q: LoadedQuestion) {
  return { id: q.id, category: q.category, prompt: q.prompt, note: q.note };
}

/* ------------------------------------------------------------------ turns */

export type Mode = 'daily' | 'night';

export function checkPlayer(playerId: unknown): string {
  if (typeof playerId !== 'string' || !/^[A-Za-z0-9_-]{8,64}$/.test(playerId)) throw new GameError(400, 'Mã người chơi không hợp lệ.');
  return playerId;
}

async function ensureInSet(db: Db, mode: Mode, day: string, questionId: string) {
  if (mode !== 'daily') return;
  const set = await dailySet(db, day);
  if (!set.includes(questionId)) throw new GameError(400, 'Câu này không thuộc chuyến bay hôm nay.');
}

/** Opens the clock on a question. Daily turns can be opened once; night turns restart. */
export async function startTurn(db: Db, a: { playerId: string; day: string; mode: Mode; questionId: string }) {
  await ensureInSet(db, a.mode, a.day, a.questionId);
  if (a.mode === 'daily') {
    await db.query(
      `insert into turns (player_id, day, mode, question_id) values ($1,$2::date,$3,$4) on conflict do nothing`,
      [a.playerId, a.day, a.mode, a.questionId],
    );
  } else {
    await db.query(
      `insert into turns (player_id, day, mode, question_id) values ($1,$2::date,$3,$4)
       on conflict (player_id, day, mode, question_id) do update set started_at=now(), answered_at=null, answer_key=null, tier=null, points=null`,
      [a.playerId, a.day, a.mode, a.questionId],
    );
  }
  const [t] = await db.query<{ started_at: Date; answered_at: Date | null }>(
    `select started_at, answered_at from turns where player_id=$1 and day=$2::date and mode=$3 and question_id=$4`,
    [a.playerId, a.day, a.mode, a.questionId],
  );
  return { startedAt: new Date(t.started_at).toISOString(), now: new Date().toISOString(), answered: !!t.answered_at };
}

async function openTurn(db: Db, a: { playerId: string; day: string; mode: Mode; questionId: string }, now: Date) {
  const rows = await db.query<{ started_at: Date; answered_at: Date | null }>(
    `select started_at, answered_at from turns where player_id=$1 and day=$2::date and mode=$3 and question_id=$4`,
    [a.playerId, a.day, a.mode, a.questionId],
  );
  if (!rows.length) throw new GameError(409, 'Câu này chưa được mở.');
  if (rows[0].answered_at) throw new GameError(409, 'Bạn đã trả lời câu này rồi.');
  const elapsed = (now.getTime() - new Date(rows[0].started_at).getTime()) / 1000;
  return { late: a.mode === 'daily' && elapsed > TURN_GRACE_SECONDS };
}

async function currentStreak(db: Db, a: { playerId: string; day: string; mode: Mode }) {
  const rows = await db.query<{ tier: number | null }>(
    `select tier from turns where player_id=$1 and day=$2::date and mode=$3 and answered_at is not null order by answered_at desc limit 12`,
    [a.playerId, a.day, a.mode],
  );
  let s = 0;
  for (const r of rows) {
    if (r.tier !== null && r.tier >= 2) s++;
    else break;
  }
  return s;
}

async function crowd(db: Db, q: LoadedQuestion, mine: string | null) {
  const rows = await db.query<{ answer_key: string; n: number }>(
    `select answer_key, n from counts where question_id=$1 order by n desc`,
    [q.id],
  );
  const total = rows.reduce((s, r) => s + r.n, 0);
  const pct = (n: number) => (total ? Math.round((n / total) * 1000) / 10 : 0);
  const top = rows.slice(0, 4).map((r) => ({ display: q.answers.get(r.answer_key)?.display ?? r.answer_key, pct: pct(r.n), mine: r.answer_key === mine }));
  const mineRow = mine ? rows.find((r) => r.answer_key === mine) : undefined;
  return { total, top, mine: mineRow ? pct(mineRow.n) : 0, estimated: total < 30 };
}

async function countsFor(db: Db, questionId: string, key: string) {
  const [r] = await db.query<{ c: number; t: number }>(
    `select coalesce(sum(n) filter (where answer_key=$2),0)::int as c, coalesce(sum(n),0)::int as t from counts where question_id=$1`,
    [questionId, key],
  );
  return { count: r.c, total: r.t };
}

/** Uses the cached verdict, or asks the referee (within the player's daily budget), for an answer the bank does not know. */
async function judge(db: Db, q: LoadedQuestion, input: string, playerId: string, day: string, referee: Referee) {
  const inputKey = norm(input);
  if (inputKey.length < 2 || inputKey.length > 50) return { key: null as string | null, reason: 'Đáp án quá ngắn hoặc quá dài.' };
  const cached = await db.query<{ valid: boolean; canonical_key: string | null; reason: string | null }>(
    `select valid, canonical_key, reason from verdicts where question_id=$1 and input_key=$2`,
    [q.id, inputKey],
  );
  if (cached.length) {
    const c = cached[0];
    if (c.valid && c.canonical_key && q.answers.has(c.canonical_key)) return { key: c.canonical_key, reason: '' };
    if (!c.valid) return { key: null, reason: c.reason || 'Trọng tài không công nhận đáp án này.' };
  }
  const hasReferee = referee !== nullReferee;
  const [usage] = !hasReferee ? [{ calls: 0 }] : await db.query<{ calls: number }>(
    `insert into referee_usage (player_id, day, calls) values ($1,$2::date,1)
     on conflict (player_id, day) do update set calls = referee_usage.calls + 1 returning calls`,
    [playerId, day],
  );
  if (usage.calls > REFEREE_CALLS_PER_DAY) return { key: null, reason: 'Hôm nay trọng tài đã xem quá nhiều đáp án lạ của bạn.' };
  let v;
  try {
    v = await referee(q.prompt, q.note ?? undefined, input);
  } catch {
    v = null;
  }
  if (!v) {
    // No referee available: log the answer so the village head can review it, the way Krillion grows its list.
    await db.query(
      `insert into submissions (question_id, input_key, display) values ($1,$2,$3)
       on conflict (question_id, input_key) do update set n = submissions.n + 1, last_at = now()`,
      [q.id, inputKey, input.slice(0, 60)],
    );
    return { key: null, reason: 'Chưa có trong sổ của làng. Đáp án đã được gửi để trưởng làng xem lại.' };
  }
  if (!v.valid) {
    await db.query(
      `insert into verdicts (question_id, input_key, valid, reason) values ($1,$2,false,$3) on conflict do nothing`,
      [q.id, inputKey, v.reason],
    );
    return { key: null, reason: v.reason || 'Trọng tài không công nhận đáp án này.' };
  }
  const known = q.matcher.match(v.canonical);
  let key = known?.key ?? norm(v.canonical);
  if (!known) {
    await db.query(
      `insert into answers (question_id, key, display, prior_tier, source, status) values ($1,$2,$3,4,'claude','pending') on conflict do nothing`,
      [q.id, key, v.canonical],
    );
    q.answers.set(key, { display: v.canonical, prior: 4, status: 'pending' });
  }
  await db.query(
    `insert into aliases (question_id, alias, key) values ($1,$2,$3), ($1,$4,$3) on conflict do nothing`,
    [q.id, inputKey, key, norm(v.canonical)],
  );
  q.matcher.addAlias(input, key);
  q.matcher.addAlias(v.canonical, key);
  await db.query(
    `insert into verdicts (question_id, input_key, valid, canonical_key, reason) values ($1,$2,true,$3,$4) on conflict do nothing`,
    [q.id, inputKey, key, v.reason],
  );
  return { key, reason: '' };
}

export interface AnswerResult {
  ok: boolean;
  reason?: string;
  late?: boolean;
  display?: string;
  tier?: TierIndex;
  points?: number;
  bonus?: number;
  judged?: boolean;
  crowd?: Awaited<ReturnType<typeof crowd>>;
  krill?: string;
  deep?: string[];
}

export async function answer(
  db: Db,
  a: { playerId: string; day: string; mode: Mode; questionId: string; input: string },
  referee: Referee,
  now = new Date(),
): Promise<AnswerResult> {
  const input = String(a.input ?? '').trim().slice(0, 80);
  if (!input) return { ok: false, reason: 'Chưa gõ đáp án.' };
  await ensureInSet(db, a.mode, a.day, a.questionId);
  const { late } = await openTurn(db, a, now);
  const q = await loadQuestion(db, a.questionId);
  if (late) {
    await db.query(
      `update turns set answered_at=now(), tier=-1, points=0 where player_id=$1 and day=$2::date and mode=$3 and question_id=$4`,
      [a.playerId, a.day, a.mode, a.questionId],
    );
    return { ok: false, late: true, reason: 'Hết gió rồi.', krill: q.answers.get(q.krillKey)?.display };
  }
  let key = q.matcher.match(input)?.key ?? null;
  let judged = false;
  if (!key) {
    const j = await judge(db, q, input, a.playerId, a.day, referee);
    if (!j.key) return { ok: false, reason: j.reason };
    key = j.key;
    judged = true;
  }
  const entry = q.answers.get(key)!;
  const { count, total } = await countsFor(db, q.id, key);
  const tier: TierIndex = key === q.krillKey ? 5 : tierFromCounts(entry.prior, count, total);
  const streak = tier >= 2 ? (await currentStreak(db, a)) + 1 : 0;
  const bonus = streakBonus(streak);
  const points = TIERS[tier].points + bonus;
  const updated = await db.query(
    `update turns set answered_at=now(), answer_key=$5, tier=$6, points=$7
     where player_id=$1 and day=$2::date and mode=$3 and question_id=$4 and answered_at is null returning 1`,
    [a.playerId, a.day, a.mode, a.questionId, key, tier, points],
  );
  if (!updated.length) throw new GameError(409, 'Bạn đã trả lời câu này rồi.');
  if (a.mode === 'daily') {
    await db.query(
      `insert into counts (question_id, answer_key, n) values ($1,$2,1) on conflict (question_id, answer_key) do update set n = counts.n + 1`,
      [q.id, key],
    );
  }
  const deep = [...q.answers.entries()]
    .filter(([k, v]) => v.prior === 4 && v.status === 'approved' && k !== key)
    .map(([, v]) => v.display)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  return {
    ok: true,
    display: entry.display,
    tier,
    points,
    bonus,
    judged,
    crowd: await crowd(db, q, key),
    krill: q.answers.get(q.krillKey)?.display,
    deep,
  };
}

/** Records a question the wind ran out on. */
export async function miss(db: Db, a: { playerId: string; day: string; mode: Mode; questionId: string }) {
  await db.query(
    `update turns set answered_at=now(), tier=-1, points=0 where player_id=$1 and day=$2::date and mode=$3 and question_id=$4 and answered_at is null`,
    [a.playerId, a.day, a.mode, a.questionId],
  );
  const q = await loadQuestion(db, a.questionId);
  return { krill: q.answers.get(q.krillKey)?.display, crowd: await crowd(db, q, null) };
}

/** The first letter and length pattern of one very rare answer: "Hỏi bà". */
export async function hint(db: Db, questionId: string) {
  const q = await loadQuestion(db, questionId);
  const pool = [...q.answers.values()].filter((v) => v.prior === 4 && v.status === 'approved');
  if (!pool.length) return { pattern: '' };
  const pick = pool[Math.floor(Math.random() * pool.length)].display;
  const pattern = pick
    .split(/\s+/)
    .map((w) => [...w].map((ch, i) => (i === 0 ? ch.toLocaleUpperCase('vi') : '_')).join(' '))
    .join('   ');
  return { pattern };
}

/* ------------------------------------------------------------------ runs and board */

export async function finish(db: Db, a: { playerId: string; day: string; mode: Mode; name?: string }) {
  const name = typeof a.name === 'string' ? a.name.replace(/\s+/g, ' ').trim().slice(0, 24) || null : null;
  let grid: string;
  let score: number;
  if (a.mode === 'daily') {
    const set = await dailySet(db, a.day);
    const rows = await db.query<{ question_id: string; tier: number | null; points: number | null }>(
      `select question_id, tier, points from turns where player_id=$1 and day=$2::date and mode='daily'`,
      [a.playerId, a.day],
    );
    const by = new Map(rows.map((r) => [r.question_id, r]));
    score = set.reduce((s, id) => s + (by.get(id)?.points ?? 0), 0);
    grid = set.map((id) => { const t = by.get(id)?.tier; return t == null || t < 0 ? 'x' : String(t); }).join('');
  } else {
    const rows = await db.query<{ tier: number | null; points: number | null }>(
      `select tier, points from turns where player_id=$1 and day=$2::date and mode='night' and answered_at is not null order by answered_at`,
      [a.playerId, a.day],
    );
    score = rows.reduce((s, r) => s + (r.points ?? 0), 0);
    grid = rows.map((r) => (r.tier == null || r.tier < 0 ? 'x' : String(r.tier))).join('').slice(0, 60);
  }
  const altitude = altitudeFor(score);
  await db.query(
    `insert into runs (player_id, day, mode, name, score, altitude, grid) values ($1,$2::date,$3,$4,$5,$6,$7)
     on conflict (player_id, day, mode) do update set
       name = coalesce(excluded.name, runs.name),
       score = greatest(runs.score, excluded.score),
       altitude = greatest(runs.altitude, excluded.altitude),
       grid = case when excluded.score >= runs.score then excluded.grid else runs.grid end`,
    [a.playerId, a.day, a.mode, name, score, altitude, grid],
  );
  const [r] = await db.query<{ above: number; total: number }>(
    `select count(*) filter (where altitude > $3)::int as above, count(*)::int as total from runs where day=$1::date and mode=$2`,
    [a.day, a.mode, altitude],
  );
  const beaten = r.total > 1 ? Math.round(((r.total - r.above - 1) / (r.total - 1)) * 100) : 100;
  return { score, altitude, grid, rank: r.above + 1, players: r.total, beaten };
}

export async function board(db: Db, day: string, mode: Mode, playerId?: string) {
  const rows = await db.query<{ player_id: string; name: string | null; altitude: number; score: number }>(
    `select player_id, name, altitude, score from runs where day=$1::date and mode=$2 order by altitude desc, created_at asc limit 20`,
    [day, mode],
  );
  const [{ n }] = await db.query<{ n: number }>(`select count(*)::int as n from runs where day=$1::date and mode=$2`, [day, mode]);
  return {
    players: n,
    rows: rows.map((r, i) => ({ rank: i + 1, name: r.name || 'Người thả diều', altitude: r.altitude, score: r.score, me: r.player_id === playerId })),
  };
}

/** A random active question for Thả đêm, avoiding the ones this run has already seen. */
export async function nightQuestion(db: Db, seen: string[]) {
  const rows = await db.query<{ id: string }>(
    `select id from questions where active and not (id = any($1::text[])) order by random() limit 1`,
    [seen.slice(-200)],
  );
  const id = rows[0]?.id ?? (await db.query<{ id: string }>(`select id from questions where active order by random() limit 1`))[0].id;
  return publicQuestion(await loadQuestion(db, id));
}

/* ------------------------------------------------------------------ admin */

export async function pending(db: Db) {
  return db.query<{ question_id: string; prompt: string; key: string; display: string; created_at: Date; plays: number }>(
    `select a.question_id, q.prompt, a.key, a.display, a.created_at, coalesce(c.n,0)::int as plays
     from answers a join questions q on q.id=a.question_id left join counts c on c.question_id=a.question_id and c.answer_key=a.key
     where a.status='pending' order by a.created_at desc limit 200`,
  );
}

export async function review(db: Db, a: { questionId: string; key: string; decision: 'approve' | 'reject'; tier?: number }) {
  if (a.decision === 'reject') {
    await db.query(`update answers set status='rejected' where question_id=$1 and key=$2`, [a.questionId, a.key]);
    await db.query(`update verdicts set valid=false, reason='Ban quản lý đã gỡ đáp án này.' where question_id=$1 and canonical_key=$2`, [a.questionId, a.key]);
  } else {
    const tier = Number.isInteger(a.tier) ? Math.max(0, Math.min(4, a.tier!)) : null;
    await db.query(`update answers set status='approved', prior_tier=coalesce($3, prior_tier) where question_id=$1 and key=$2`, [a.questionId, a.key, tier]);
  }
  forgetQuestion(a.questionId);
  return { ok: true };
}

export async function stats(db: Db, day: string) {
  const [r] = await db.query<{ players: number; answers: number; pending: number; queued: number; questions: number }>(
    `select (select count(*) from runs where day=$1::date and mode='daily')::int as players,
            (select count(*) from turns where day=$1::date and answered_at is not null)::int as answers,
            (select count(*) from answers where status='pending')::int as pending,
            (select count(*) from submissions where status='open')::int as queued,
            (select count(*) from questions where active)::int as questions`,
    [day],
  );
  return r;
}

/* ------------------------------------------------------------------ review queue */

export async function submissions(db: Db) {
  return db.query<{ question_id: string; prompt: string; input_key: string; display: string; n: number; last_at: Date }>(
    `select s.question_id, q.prompt, s.input_key, s.display, s.n, s.last_at
     from submissions s join questions q on q.id = s.question_id
     where s.status = 'open' order by s.n desc, s.last_at desc limit 300`,
  );
}

/** Accepts a logged answer into the bank (optionally under a corrected name or as an alias of an existing answer), or dismisses it. */
export async function decideSubmission(
  db: Db,
  a: { questionId: string; inputKey: string; decision: 'accept' | 'dismiss'; display?: string; tier?: number },
) {
  const rows = await db.query<{ display: string }>(
    `select display from submissions where question_id=$1 and input_key=$2`,
    [a.questionId, a.inputKey],
  );
  if (!rows.length) throw new GameError(404, 'Không tìm thấy đáp án này trong hàng chờ.');
  if (a.decision === 'dismiss') {
    await db.query(`update submissions set status='dismissed' where question_id=$1 and input_key=$2`, [a.questionId, a.inputKey]);
    await db.query(
      `insert into verdicts (question_id, input_key, valid, reason) values ($1,$2,false,'Trưởng làng đã xem và không công nhận đáp án này.')
       on conflict (question_id, input_key) do update set valid=false, reason=excluded.reason`,
      [a.questionId, a.inputKey],
    );
    return { ok: true };
  }
  const display = (a.display ?? rows[0].display).trim().slice(0, 60);
  if (!display) throw new GameError(400, 'Tên đáp án trống.');
  const q = await loadQuestion(db, a.questionId);
  const existing = q.matcher.match(display);
  const key = existing?.key ?? norm(display);
  const tier = Number.isInteger(a.tier) ? Math.max(0, Math.min(4, a.tier!)) : 4;
  if (!existing) {
    await db.query(
      `insert into answers (question_id, key, display, prior_tier, source, status) values ($1,$2,$3,$4,'player','approved')
       on conflict (question_id, key) do update set status='approved', prior_tier=excluded.prior_tier`,
      [a.questionId, key, display, tier],
    );
  }
  await db.query(
    `insert into aliases (question_id, alias, key) values ($1,$2,$3), ($1,$4,$3) on conflict do nothing`,
    [a.questionId, a.inputKey, key, norm(display)],
  );
  await db.query(`update submissions set status='accepted' where question_id=$1 and input_key=$2`, [a.questionId, a.inputKey]);
  await db.query(`delete from verdicts where question_id=$1 and input_key=$2`, [a.questionId, a.inputKey]);
  forgetQuestion(a.questionId);
  return { ok: true, key };
}
