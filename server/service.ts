import { BOOK, BOOK_BY_ID, BOOK_VERSION } from '../shared/book/questions.js';
import { Matcher } from '../shared/match.js';
import { norm, soft } from '../shared/normalize.js';
import {
  CUNG_TRANG,
  KHON_LOI,
  QUESTION_SECONDS,
  TIERS,
  isRare,
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
/** Seconds a daily turn may stay open: the wind, the referee's think time and network slack. */
const TURN_GRACE_SECONDS = QUESTION_SECONDS + 10 + 15;
const REFEREE_CALLS_PER_DAY = 25;

/* ------------------------------------------------------------------ setup */

/**
 * Creates tables and syncs the questions table with the village book. Answers live in code (the book);
 * the database only keeps what players and the village head add, plus counts. Safe to run again.
 */
export async function setup(db: Db) {
  await db.exec(SCHEMA);
  const ids = BOOK.map((q) => q.id);
  await db.query(
    `insert into questions (id, category, prompt, note, strip, krill_key, active)
     select id, c, p, nullif(n, ''), string_to_array(st, ' '), k, true
     from unnest($1::text[], $2::text[], $3::text[], $4::text[], $5::text[], $6::text[]) as x(id, c, p, n, st, k)
     on conflict (id) do update set category=excluded.category, prompt=excluded.prompt, note=excluded.note,
       strip=excluded.strip, krill_key=excluded.krill_key, active=true`,
    [
      ids,
      BOOK.map((q) => q.category),
      BOOK.map((q) => q.prompt),
      BOOK.map((q) => q.note ?? ''),
      BOOK.map((q) => q.strip.join(' ')),
      BOOK.map((q) => q.krillKey),
    ],
  );
  await db.query(`update questions set active=false where not (id = any($1::text[]))`, [ids]);
  await db.query(
    `insert into meta (key, value) values ('book_version', $1) on conflict (key) do update set value=excluded.value`,
    [BOOK_VERSION],
  );
  const [{ n }] = await db.query<{ n: number }>(`select count(*)::int as n from questions where active`);
  return { questions: n, version: BOOK_VERSION };
}

/** The book version the database was last synced with, or null for a fresh database. */
export async function syncedVersion(db: Db): Promise<string | null> {
  try {
    const rows = await db.query<{ value: string }>(`select value from meta where key='book_version'`);
    return rows[0]?.value ?? null;
  } catch {
    return null;
  }
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

/** Difficulty plan for the seven daily questions: warm up, build, end on the hardest. */
const LEVEL_PLAN = [1, 2, 1, 2, 3, 2, 3];
/** Slots held for pop-culture questions (films, songs, snacks, apps), which make the rare answers worth showing off. */
const POP_SLOTS = [1, 4];
const isPop = (id: string) => id.startsWith('pop-');

/**
 * The day's question ids, created on first request: easy to hard, no two from the same category or lexicon,
 * and nothing asked in the last six weeks while there is enough left to choose from.
 */
export async function dailySet(db: Db, day: string): Promise<string[]> {
  const found = await db.query<{ question_ids: string[] }>(`select question_ids from daily_sets where day=$1::date`, [day]);
  if (found.length) return found[0].question_ids;
  const active = new Set((await db.query<{ id: string }>(`select id from questions where active`)).map((r) => r.id));
  const pool = BOOK.filter((q) => active.has(q.id));
  const recentRows = await db.query<{ day: string; question_ids: string[] }>(
    `select to_char(day, 'YYYY-MM-DD') as day, question_ids from daily_sets where day < $1::date and day >= $1::date - 42`,
    [day],
  );
  const rnd = seeded('tha-dieu-' + day);
  const order = pool.map((q) => ({ q, r: rnd() })).sort((a, b) => a.r - b.r).map((x) => x.q);
  const pick: typeof pool = [];
  for (const window of [42, 14, 3, 0]) {
    const cutoff = new Date(new Date(day + 'T00:00:00Z').getTime() - window * 86400_000).toISOString().slice(0, 10);
    const recent = new Set(recentRows.filter((r) => r.day >= cutoff).flatMap((r) => r.question_ids));
    for (const level of LEVEL_PLAN.slice(pick.length)) {
      const slot = pick.length;
      const ok = (q: (typeof pool)[number], strictLevel: boolean) =>
        !recent.has(q.id) &&
        isPop(q.id) === POP_SLOTS.includes(slot) &&
        !pick.includes(q) &&
        (!strictLevel || (q.level ?? 2) === level) &&
        !pick.some((p) => p.category === q.category || p.family === q.family);
      const next = order.find((q) => ok(q, true)) ?? order.find((q) => ok(q, false));
      if (!next) break;
      pick.push(next);
    }
    if (pick.length >= DAILY_COUNT) break;
  }
  for (const q of order) if (pick.length < DAILY_COUNT && !pick.includes(q)) pick.push(q);
  const ids = pick.slice(0, DAILY_COUNT).map((q) => q.id);
  await db.query(`insert into daily_sets (day, question_ids) values ($1::date, $2) on conflict (day) do nothing`, [day, ids]);
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
  level: number;
  answers: Map<string, { display: string; prior: number; status: string }>;
  matcher: Matcher;
  vague: Set<string>;
  traps: Set<string>;
}

const cache = new Map<string, { at: number; q: LoadedQuestion }>();
const CACHE_MS = 60_000;

export function forgetQuestion(id: string) {
  cache.delete(id);
}

/** A question from the book, plus answers and spellings learned from players (review queue, referee). */
export async function loadQuestion(db: Db, id: string): Promise<LoadedQuestion> {
  const hit = cache.get(id);
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.q;
  const base = BOOK_BY_ID.get(id);
  if (!base) throw new GameError(404, 'Không tìm thấy câu hỏi.');
  const answers = new Map(base.answers.map((a) => [a.key, { display: a.display, prior: a.priorTier, status: 'approved' }]));
  const entries = base.answers.map((a) => ({ key: a.key, aliases: [...a.aliases], priorTier: a.priorTier }));
  const learned = await db.query<{ key: string; display: string; prior_tier: number; status: string; source: string }>(
    `select key, display, prior_tier, status, source from answers where question_id=$1 and (source <> 'seed' or status = 'rejected')`,
    [id],
  );
  const rekey = new Map<string, string>();
  for (const l of learned) {
    const key = answers.has(l.key) ? l.key : soft(l.display);
    rekey.set(l.key, key);
    if (l.status === 'rejected') {
      answers.delete(key);
      continue;
    }
    if (!answers.has(key)) {
      answers.set(key, { display: l.display, prior: l.prior_tier, status: l.status });
      entries.push({ key, aliases: [l.display], priorTier: l.prior_tier });
    }
  }
  const matcher = new Matcher(base.strip, entries.filter((e) => answers.has(e.key)));
  const al = await db.query<{ alias: string; key: string }>(`select alias, key from aliases where question_id=$1`, [id]);
  for (const a of al) {
    const key = rekey.get(a.key) ?? a.key;
    if (answers.has(key)) matcher.addAlias(a.alias, key, answers.get(key)!.prior);
  }
  const q: LoadedQuestion = {
    id: base.id,
    category: base.category,
    prompt: base.prompt,
    note: base.note ?? null,
    krillKey: base.krillKey,
    strip: base.strip,
    level: base.level ?? 2,
    answers,
    matcher,
    vague: new Set((base.vague ?? []).flatMap((v) => [soft(v), norm(v)])),
    traps: new Set(base.traps ?? []),
  };
  cache.set(id, { at: Date.now(), q });
  return q;
}

export function publicQuestion(q: LoadedQuestion) {
  return { id: q.id, category: q.category, prompt: q.prompt, note: q.note, pool: q.answers.size, level: q.level };
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
    if (isRare(r.tier)) s++;
    else break;
  }
  return s;
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
  const inputKey = soft(input);
  if (norm(input).length < 1 || inputKey.length > 50) return { key: null as string | null, reason: 'Đáp án quá ngắn hoặc quá dài.' };
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
  if (usage.calls > REFEREE_CALLS_PER_DAY) return { key: null, reason: 'Hôm nay trọng tài đã xem quá nhiều đáp án lạ của bạn. Thử một đáp án quen hơn nhé.' };
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
    return { key: null, reason: 'Làng chưa biết đáp án này. Thử một đáp án khác nhé, đáp án đã được gửi cho trưởng làng xem.' };
  }
  if (!v.valid) {
    await db.query(
      `insert into verdicts (question_id, input_key, valid, reason) values ($1,$2,false,$3) on conflict do nothing`,
      [q.id, inputKey, v.reason],
    );
    return { key: null, reason: v.reason || 'Trọng tài không công nhận đáp án này.' };
  }
  const known = q.matcher.match(v.canonical);
  const key = known?.key ?? soft(v.canonical);
  if (!known) {
    await db.query(
      `insert into answers (question_id, key, display, prior_tier, source, status) values ($1,$2,$3,4,'claude','pending') on conflict do nothing`,
      [q.id, key, v.canonical],
    );
    q.answers.set(key, { display: v.canonical, prior: 4, status: 'pending' });
  }
  await db.query(
    `insert into aliases (question_id, alias, key) values ($1,$2,$3), ($1,$4,$3) on conflict do nothing`,
    [q.id, inputKey, key, soft(v.canonical)],
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
  /** landed: scored · retry: not an answer the village or the referee accepts, try another while the wind lasts
   *  late: the wind ran out · confirm: a near match to accept · vague: too general ("chim" for a bird) · empty: nothing typed
   *  nothing: kept for older clients, no longer sent */
  status: 'landed' | 'retry' | 'nothing' | 'late' | 'confirm' | 'vague' | 'empty';
  input?: string;
  suggestion?: string;
  reason?: string;
  display?: string;
  tier?: TierIndex;
  points?: number;
  bonus?: number;
  judged?: boolean;
  /** Percentage of today's players who gave the same answer, once enough people have played. */
  share?: number | null;
  /** What the rest of the village answered. */
  crowd?: Crowd;
}

export interface Crowd {
  /** Players who have answered this prompt. */
  total: number;
  /** Most given answers; pct is null while the list is the book's guess rather than real counts. */
  top: { display: string; pct: number | null; mine: boolean }[];
  /** This player's share, when known. */
  mine: number | null;
  estimated: boolean;
}

/** Players needed before the crowd panel shows real percentages instead of the book's guess. */
const CROWD_MIN = 20;

export async function crowdFor(db: Db, q: LoadedQuestion, key: string | null): Promise<Crowd> {
  const rows = await db.query<{ answer_key: string; n: number }>(`select answer_key, n from counts where question_id=$1 order by n desc`, [q.id]);
  const total = rows.reduce((t, r) => t + r.n, 0);
  if (total >= CROWD_MIN) {
    const pct = (n: number) => Math.round((n / total) * 1000) / 10;
    const top = rows.slice(0, 4).map((r) => ({ display: q.answers.get(r.answer_key)?.display ?? r.answer_key, pct: pct(r.n), mine: r.answer_key === key }));
    const mineRow = rows.find((r) => r.answer_key === key);
    return { total, top, mine: mineRow ? pct(mineRow.n) : 0, estimated: false };
  }
  const guess = [...q.answers.entries()]
    .filter(([k, a]) => a.status === 'approved' && k !== q.krillKey)
    .sort((a, b) => a[1].prior - b[1].prior)
    .slice(0, 4)
    .map(([k, a]) => ({ display: a.display, pct: null, mine: k === key }));
  return { total, top: guess, mine: null, estimated: true };
}

/** Minimum players before the crowd can call an answer Khôn lỏi on its own. */
const KHON_LOI_MIN_PLAYERS = 30;

/**
 * The tier an answer lands at. Besides plain rarity, an answer the book expected to be uncommon but that many
 * players give is Khôn lỏi: the pick that feels clever but that half the village reaches for.
 */
export function tierFor(q: Pick<LoadedQuestion, 'krillKey' | 'traps'>, key: string, prior: number, count: number, total: number): TierIndex {
  if (key === q.krillKey) return CUNG_TRANG;
  const base = tierFromCounts(prior, count, total);
  const enough = total >= KHON_LOI_MIN_PLAYERS;
  if (q.traps.has(key) && (!enough || base <= 2)) return KHON_LOI;
  if (enough && prior >= 2 && base <= 1) return KHON_LOI;
  return base;
}

async function closeTurn(db: Db, a: { playerId: string; day: string; mode: Mode; questionId: string }) {
  await db.query(
    `update turns set answered_at=now(), tier=-1, points=0 where player_id=$1 and day=$2::date and mode=$3 and question_id=$4 and answered_at is null`,
    [a.playerId, a.day, a.mode, a.questionId],
  );
}

/**
 * One answer per prompt, as in Krillion: an answer the village book does not know ends the prompt with nothing.
 * A near miss on a known answer is not scored yet; the player is shown the corrected name and submits again to accept it.
 */
export async function answer(
  db: Db,
  a: { playerId: string; day: string; mode: Mode; questionId: string; input: string },
  referee: Referee,
  now = new Date(),
): Promise<AnswerResult> {
  const input = String(a.input ?? '').trim().slice(0, 80);
  if (!input) return { status: 'empty' };
  await ensureInSet(db, a.mode, a.day, a.questionId);
  const { late } = await openTurn(db, a, now);
  const q = await loadQuestion(db, a.questionId);
  if (late) {
    await closeTurn(db, a);
    return { status: 'late', input };
  }
  const m = q.matcher.match(input);
  if (m && !m.exact) {
    const suggestion = q.answers.get(m.key)!.display;
    return { status: 'confirm', input, suggestion };
  }
  if (!m && (q.vague.has(soft(input)) || q.vague.has(norm(input)))) {
    return { status: 'vague', input, reason: `“${input}” chung chung quá. Hãy kể tên một thứ cụ thể hơn.` };
  }
  let key = m?.key ?? null;
  let judged = false;
  if (!key) {
    const j = await judge(db, q, input, a.playerId, a.day, referee);
    // Nobody loses a prompt to an answer the village does not know: they try again while the wind lasts.
    if (!j.key) return { status: 'retry', input, reason: j.reason };
    key = j.key;
    judged = true;
  }
  const entry = q.answers.get(key)!;
  const { count, total } = await countsFor(db, q.id, key);
  const tier = tierFor(q, key, entry.prior, count, total);
  const streak = isRare(tier) ? (await currentStreak(db, a)) + 1 : 0;
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
  const after = await countsFor(db, q.id, key);
  const share = after.total >= 30 ? Math.round((after.count / after.total) * 1000) / 10 : null;
  dayCache.delete(a.day);
  return { status: 'landed', input, display: entry.display, tier, points, bonus, judged, share, crowd: await crowdFor(db, q, key) };
}

/** Records a question the wind ran out on. Nothing about the answers is revealed. */
export async function miss(db: Db, a: { playerId: string; day: string; mode: Mode; questionId: string }) {
  await closeTurn(db, a);
  return { ok: true };
}

/* ------------------------------------------------------------------ runs and board */

/**
 * Daily scores, recomputed from everyone's answers. An answer's tier is not fixed at the moment it is given:
 * every player of the day is scored with the same crowd data, so playing early or late makes no difference,
 * and the board settles when the day ends.
 */
const dayCache = new Map<string, { at: number; scores: Map<string, { score: number; grid: string }> }>();
const DAY_CACHE_MS = 30_000;

export async function scoreDay(db: Db, day: string, fresh = false) {
  const hit = dayCache.get(day);
  if (!fresh && hit && Date.now() - hit.at < DAY_CACHE_MS) return hit.scores;
  const set = await dailySet(db, day);
  const qs = new Map(await Promise.all(set.map(async (id) => [id, await loadQuestion(db, id)] as const)));
  const countRows = await db.query<{ question_id: string; answer_key: string; n: number }>(
    `select question_id, answer_key, n from counts where question_id = any($1::text[])`,
    [set],
  );
  const counts = new Map<string, Map<string, number>>();
  const totals = new Map<string, number>();
  for (const r of countRows) {
    if (!counts.has(r.question_id)) counts.set(r.question_id, new Map());
    counts.get(r.question_id)!.set(r.answer_key, r.n);
    totals.set(r.question_id, (totals.get(r.question_id) ?? 0) + r.n);
  }
  const turns = await db.query<{ player_id: string; question_id: string; answer_key: string | null; tier: number | null }>(
    `select player_id, question_id, answer_key, tier from turns where day=$1::date and mode='daily' and answered_at is not null order by answered_at`,
    [day],
  );
  const by = new Map<string, { streak: number; score: number; tiers: Map<string, number> }>();
  for (const t of turns) {
    const p = by.get(t.player_id) ?? { streak: 0, score: 0, tiers: new Map() };
    by.set(t.player_id, p);
    const q = qs.get(t.question_id);
    if (!q || !t.answer_key || t.tier == null || t.tier < 0) {
      p.streak = 0;
      p.tiers.set(t.question_id, -1);
      continue;
    }
    const entry = q.answers.get(t.answer_key);
    const c = counts.get(q.id)?.get(t.answer_key) ?? 1;
    // The player's own answer is in the counts; score it as the crowd minus themselves, as at answer time.
    const tier = entry ? tierFor(q, t.answer_key, entry.prior, Math.max(0, c - 1), Math.max(0, (totals.get(q.id) ?? 1) - 1)) : t.tier;
    p.streak = isRare(tier) ? p.streak + 1 : 0;
    p.score += TIERS[tier].points + streakBonus(p.streak);
    p.tiers.set(t.question_id, tier);
  }
  const scores = new Map<string, { score: number; grid: string }>();
  for (const [pid, p] of by) {
    scores.set(pid, { score: p.score, grid: set.map((id) => { const t = p.tiers.get(id); return t == null || t < 0 ? 'x' : String(t); }).join('') });
  }
  dayCache.set(day, { at: Date.now(), scores });
  return scores;
}

interface Standing {
  player_id: string;
  name: string | null;
  score: number;
  altitude: number;
  grid: string;
  replay: boolean;
}

/** The day's runs ranked by settled score. A second run from the same device on the same day stays off the board. */
async function standings(db: Db, day: string, mode: Mode, fresh = false): Promise<Standing[]> {
  const runs = await db.query<{ player_id: string; name: string | null; score: number; altitude: number; grid: string; dev: string | null; fresh: boolean | null }>(
    `select player_id, name, score, altitude, grid, dev, fresh from runs where day=$1::date and mode=$2 order by created_at asc`,
    [day, mode],
  );
  const scores = mode === 'daily' ? await scoreDay(db, day, fresh) : null;
  const seenDev = new Set<string>();
  const out: Standing[] = runs.map((r) => {
    // Only a player first seen today counts as a replay: a family sharing a network and a phone model keeps its runs.
    const replay = !!r.dev && !!r.fresh && seenDev.has(r.dev);
    if (r.dev) seenDev.add(r.dev);
    const s = scores?.get(r.player_id);
    const score = s ? s.score : r.score;
    return { player_id: r.player_id, name: r.name, score, altitude: s ? altitudeFor(score) : r.altitude, grid: s ? s.grid : r.grid, replay };
  });
  return out.sort((a, b) => b.altitude - a.altitude);
}

export interface Reveal {
  questionId: string;
  prompt: string;
  /** The hidden Cung Trăng answer. */
  krill: string;
  /** What most of the village answered. */
  top: string;
  mine: string | null;
  tier: number;
}

async function revealDay(db: Db, day: string, playerId: string, grid: string): Promise<Reveal[]> {
  const set = await dailySet(db, day);
  const mineRows = await db.query<{ question_id: string; answer_key: string | null }>(
    `select question_id, answer_key from turns where player_id=$1 and day=$2::date and mode='daily'`,
    [playerId, day],
  );
  const mine = new Map(mineRows.map((r) => [r.question_id, r.answer_key]));
  return Promise.all(
    set.map(async (id, i) => {
      const q = await loadQuestion(db, id);
      const c = await crowdFor(db, q, null);
      const k = mine.get(id);
      return {
        questionId: id,
        prompt: q.prompt,
        krill: q.answers.get(q.krillKey)?.display ?? q.krillKey,
        top: c.top[0]?.display ?? '',
        mine: k ? q.answers.get(k)?.display ?? null : null,
        tier: grid[i] === 'x' || grid[i] == null ? -1 : Number(grid[i]),
      };
    }),
  );
}

async function flightDone(db: Db, day: string, playerId: string) {
  const set = await dailySet(db, day);
  const [r] = await db.query<{ n: number }>(
    `select count(*)::int as n from turns where player_id=$1 and day=$2::date and mode='daily' and answered_at is not null and question_id = any($3::text[])`,
    [playerId, day, set],
  );
  return r.n >= set.length;
}

export async function finish(db: Db, a: { playerId: string; day: string; mode: Mode; name?: string; dev?: string; since?: string }) {
  const name = typeof a.name === 'string' ? a.name.replace(/\s+/g, ' ').trim().slice(0, 24) || null : null;
  let grid: string;
  let score: number;
  if (a.mode === 'daily') {
    const s = (await scoreDay(db, a.day, true)).get(a.playerId);
    score = s?.score ?? 0;
    grid = s?.grid ?? 'x'.repeat(DAILY_COUNT);
  } else {
    const rows = await db.query<{ tier: number | null; points: number | null }>(
      `select tier, points from turns where player_id=$1 and day=$2::date and mode='night' and answered_at is not null order by answered_at`,
      [a.playerId, a.day],
    );
    score = rows.reduce((s, r) => s + (r.points ?? 0), 0);
    grid = rows.map((r) => (r.tier == null || r.tier < 0 ? 'x' : String(r.tier))).join('').slice(0, 60);
  }
  const altitude = altitudeFor(score, a.mode);
  await db.query(
    `insert into runs (player_id, day, mode, name, score, altitude, grid, dev, fresh) values ($1,$2::date,$3,$4,$5,$6,$7,$8,$9)
     on conflict (player_id, day, mode) do update set
       name = coalesce(excluded.name, runs.name),
       score = case when runs.mode = 'daily' then excluded.score else greatest(runs.score, excluded.score) end,
       altitude = case when runs.mode = 'daily' then excluded.altitude else greatest(runs.altitude, excluded.altitude) end,
       grid = case when runs.mode = 'daily' or excluded.score >= runs.score then excluded.grid else runs.grid end`,
    [a.playerId, a.day, a.mode, name, score, altitude, grid, a.dev ?? null, !!a.since && a.since >= a.day],
  );
  const all = await standings(db, a.day, a.mode);
  const me = all.find((r) => r.player_id === a.playerId);
  const ranked = all.filter((r) => !r.replay);
  const above = ranked.filter((r) => r.altitude > altitude).length;
  const total = ranked.length + (me?.replay ? 1 : 0);
  const beaten = total > 1 ? Math.round(((total - above - 1) / (total - 1)) * 100) : 100;
  const settled = a.day < vnToday();
  return {
    score,
    altitude,
    grid,
    rank: above + 1,
    players: total,
    beaten,
    replay: !!me?.replay,
    settled,
    // The hidden answers are shown only once the whole flight is done, so they cannot be scouted for another account.
    reveal: a.mode === 'daily' && (await flightDone(db, a.day, a.playerId)) ? await revealDay(db, a.day, a.playerId, grid) : undefined,
  };
}

export async function board(db: Db, day: string, mode: Mode, playerId?: string) {
  const all = await standings(db, day, mode);
  const ranked = all.filter((r) => !r.replay);
  return {
    players: ranked.length,
    settled: day < vnToday(),
    rows: ranked.slice(0, 20).map((r, i) => ({ rank: i + 1, name: r.name || 'Người thả diều', altitude: r.altitude, score: r.score, me: r.player_id === playerId })),
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
  const key = existing && existing.exact ? existing.key : soft(display);
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
    [a.questionId, a.inputKey, key, soft(display)],
  );
  await db.query(`update submissions set status='accepted' where question_id=$1 and input_key=$2`, [a.questionId, a.inputKey]);
  await db.query(`delete from verdicts where question_id=$1 and input_key=$2`, [a.questionId, a.inputKey]);
  forgetQuestion(a.questionId);
  return { ok: true, key };
}
