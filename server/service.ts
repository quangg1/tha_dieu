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
const REFEREE_CALLS_PER_DAY = 40;
/** Referee calls one network may spend in a day, whatever player ids it invents. */
const REFEREE_CALLS_PER_NET = 300;
/** Players from one network whose answers count towards the day's rarity. A school or a café shares an address; a script does too. */
const NET_PLAYERS_COUNTED = 60;

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
const setCache = new Map<string, string[]>();

export async function dailySet(db: Db, day: string): Promise<string[]> {
  const cached = setCache.get(day);
  if (cached) return cached;
  const found = await db.query<{ question_ids: string[] }>(`select question_ids from daily_sets where day=$1::date`, [day]);
  if (found.length) {
    setCache.set(day, found[0].question_ids);
    return found[0].question_ids;
  }
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
  return { id: q.id, category: q.category, prompt: q.prompt, note: q.note, level: q.level };
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
async function judge(db: Db, q: LoadedQuestion, input: string, playerId: string, day: string, referee: Referee, net?: string) {
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
  if (hasReferee && net && !(await hit(db, `ref:${net}`, day, REFEREE_CALLS_PER_NET))) {
    return { key: null, reason: 'Trọng tài đang quá tải với mạng của bạn. Thử một đáp án quen hơn nhé.' };
  }
  if (hasReferee && !(await hit(db, 'ref:all', day, Number(process.env.REFEREE_DAILY_MAX) || 5000))) {
    return { key: null, reason: 'Hôm nay trọng tài đã làm việc hết sức. Thử một đáp án quen hơn nhé.' };
  }
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
  a: { playerId: string; day: string; mode: Mode; questionId: string; input: string; net?: string },
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
    const j = await judge(db, q, input, a.playerId, a.day, referee, a.net);
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
  if (a.mode === 'daily' && (await countable(db, a.net, a.day, a.playerId))) {
    await db.query(
      `insert into counts (question_id, answer_key, n) values ($1,$2,1) on conflict (question_id, answer_key) do update set n = counts.n + 1`,
      [q.id, key],
    );
  }
  const after = await countsFor(db, q.id, key);
  const share = after.total >= 30 ? Math.round((after.count / after.total) * 1000) / 10 : null;
  return { status: 'landed', input, display: entry.display, tier, points, bonus, judged, share, crowd: await crowdFor(db, q, key) };
}

/** Adds one to a counter for this window and says whether it is still within the limit. */
export async function hit(db: Db, k: string, win: string, limit: number) {
  const [r] = await db.query<{ n: number }>(
    `insert into limits (k, win, n) values ($1,$2,1) on conflict (k, win) do update set n = limits.n + 1 returning n`,
    [k, win],
  );
  return r.n <= limit;
}

/** Old counters go after a day. */
export async function sweepLimits(db: Db) {
  await db.query(`delete from limits where day < current_date - 1`);
  await db.query(`delete from net_players where day < current_date - 2`);
}

/** Whether this player's answers move the day's counts: the first players from each network do. */
async function countable(db: Db, net: string | undefined, day: string, playerId: string) {
  if (!net) return true;
  // One round trip: join the network's list if it still has room, then say whether this player is on it.
  const [r] = await db.query<{ ok: boolean }>(
    `with ins as (
       insert into net_players (net, day, player_id)
       select $1, $2::date, $3 where (select count(*) from net_players where net=$1 and day=$2::date) < $4
       on conflict do nothing returning 1)
     select exists (select 1 from ins) or exists (select 1 from net_players where net=$1 and day=$2::date and player_id=$3) as ok`,
    [net, day, playerId, NET_PLAYERS_COUNTED],
  );
  return !!r?.ok;
}

/* ------------------------------------------------------------------ events and reports */

export const EVENT_NAMES = new Set(['open', 'invite', 'start', 'retry', 'miss', 'finish', 'share', 'challenge', 'challenge_open', 'lap', 'report', 'error', 'howto', 'bag', 'support']);

export async function logEvent(db: Db, a: { day: string; name: string; playerId?: string; props?: unknown }) {
  if (!EVENT_NAMES.has(a.name)) throw new GameError(400, 'Sự kiện không hợp lệ.');
  let props: string | null = null;
  if (a.props && typeof a.props === 'object') {
    props = JSON.stringify(a.props);
    if (props.length > 800) props = JSON.stringify({ cut: props.slice(0, 780) });
  }
  await db.query(`insert into events (day, name, player_id, props) values ($1::date,$2,$3,$4::jsonb)`, [a.day, a.name, a.playerId?.slice(0, 64) ?? null, props]);
  return { ok: true };
}

/** A player says the referee got it wrong: an answer that should count, or one that should not. */
export async function report(db: Db, a: { questionId: string; input: string; kind: 'rejected' | 'accepted'; note?: string }) {
  const input = String(a.input ?? '').trim().slice(0, 60);
  if (!input) throw new GameError(400, 'Thiếu đáp án.');
  const exists = await db.query(`select 1 from questions where id=$1`, [a.questionId]);
  if (!exists.length) throw new GameError(404, 'Không có câu hỏi này.');
  await db.query(
    `insert into reports (question_id, input_key, display, kind, note) values ($1,$2,$3,$4,$5)
     on conflict (question_id, input_key, kind) do update set n = reports.n + 1, last_at = now(), status = 'open', note = coalesce($5, reports.note)`,
    [a.questionId, norm(input), input, a.kind, a.note?.slice(0, 200) || null],
  );
  return { ok: true };
}

export async function reports(db: Db) {
  return db.query<{ question_id: string; prompt: string; input_key: string; display: string; kind: string; n: number; note: string | null }>(
    `select r.question_id, q.prompt, r.input_key, r.display, r.kind, r.n, r.note
     from reports r join questions q on q.id = r.question_id
     where r.status = 'open' order by r.n desc, r.last_at desc limit 200`,
  );
}

export async function closeReport(db: Db, a: { questionId: string; inputKey: string; kind: string }) {
  await db.query(`update reports set status='closed' where question_id=$1 and input_key=$2 and kind=$3`, [a.questionId, a.inputKey, a.kind]);
  return { ok: true };
}

/** The admin dashboard: daily funnel, scores, retention, today's questions and the latest errors. */
export async function insights(db: Db) {
  const today = vnToday();
  const funnel = await db.query<{ day: string; name: string; players: number; n: number }>(
    `select to_char(day,'YYYY-MM-DD') as day, name, count(distinct player_id)::int as players, count(*)::int as n
     from events where day >= $1::date - 7 group by day, name order by day desc, name`,
    [today],
  );
  const days = await db.query<{ day: string; opens: number; starts: number; finishes: number; sharers: number; invited: number; fresh: number }>(
    `with f as (select player_id, min(day) as d0 from events group by player_id)
     select to_char(e.day,'YYYY-MM-DD') as day,
       count(distinct e.player_id) filter (where e.name='open')::int as opens,
       count(distinct e.player_id) filter (where e.name='start')::int as starts,
       count(distinct e.player_id) filter (where e.name='finish')::int as finishes,
       count(distinct e.player_id) filter (where e.name in ('share','challenge'))::int as sharers,
       count(distinct e.player_id) filter (where e.name='challenge_open')::int as invited,
       count(distinct e.player_id) filter (where f.d0 = e.day)::int as fresh
     from events e left join f using (player_id)
     where e.day >= $1::date - 13 group by e.day order by e.day desc`,
    [today],
  );
  const scores = await db.query<{ day: string; players: number; avg: number; best: number }>(
    `select to_char(day,'YYYY-MM-DD') as day, count(*)::int as players, round(avg(score))::int as avg, max(score)::int as best
     from runs where mode='daily' and day >= $1::date - 13 group by day order by day desc`,
    [today],
  );
  const retention = await db.query<{ day: string; cohort: number; d1: number; d7: number }>(
    `with f as (select player_id, min(day) as d0 from events group by player_id)
     select to_char(f.d0,'YYYY-MM-DD') as day, count(*)::int as cohort,
       count(*) filter (where exists (select 1 from events e where e.player_id=f.player_id and e.day=f.d0+1))::int as d1,
       count(*) filter (where exists (select 1 from events e where e.player_id=f.player_id and e.day between f.d0+1 and f.d0+7))::int as d7
     from f where f.d0 >= $1::date - 14 and f.d0 < $1::date group by f.d0 order by f.d0 desc`,
    [today],
  );
  const questions = await db.query<{ id: string; prompt: string; answered: number; misses: number; krill: number; clever: number; avg: number; retries: number }>(
    `select q.id, q.prompt,
       count(t.*) filter (where t.answered_at is not null and t.tier >= 0)::int as answered,
       count(t.*) filter (where t.tier = -1)::int as misses,
       count(t.*) filter (where t.tier = 5)::int as krill,
       count(t.*) filter (where t.tier = 6)::int as clever,
       coalesce(round(avg(t.points) filter (where t.tier >= 0)),0)::int as avg,
       (select count(*) from events e where e.day=$1::date and e.name='retry' and e.props->>'q' = q.id)::int as retries
     from daily_sets d cross join unnest(d.question_ids) with ordinality as u(qid, ord)
     join questions q on q.id = u.qid
     left join turns t on t.question_id = q.id and t.day = d.day and t.mode = 'daily'
     where d.day = $1::date group by q.id, q.prompt, u.ord order by u.ord`,
    [today],
  );
  const [totals] = await db.query<{ players: number; runs: number; answers: number }>(
    `select (select count(distinct player_id) from events)::int as players,
            (select count(*) from runs where mode='daily')::int as runs,
            (select count(*) from turns where answered_at is not null)::int as answers`,
  );
  const errors = await db.query<{ message: string; n: number; last: Date }>(
    `select coalesce(props->>'m','?') as message, count(*)::int as n, max(at) as last
     from events where name='error' and day >= $1::date - 7 group by 1 order by n desc limit 30`,
    [today],
  );
  return { today, funnel, days, scores, retention, questions, totals, errors };
}

/* ------------------------------------------------------------------ feedback and support */

const FEEDBACK_KINDS = new Set(['gopy', 'loi', 'cauhoi']);

export async function sendFeedback(db: Db, a: { kind: string; message: string; contact?: string; playerId?: string }) {
  const message = String(a.message ?? '').trim().slice(0, 1500);
  if (message.length < 3) throw new GameError(400, 'Bạn viết thêm vài chữ nhé.');
  const kind = FEEDBACK_KINDS.has(a.kind) ? a.kind : 'gopy';
  const contact = String(a.contact ?? '').trim().slice(0, 120) || null;
  await db.query(`insert into feedback (kind, message, contact, player_id) values ($1,$2,$3,$4)`, [kind, message, contact, a.playerId?.slice(0, 64) ?? null]);
  return { ok: true };
}

export async function listFeedback(db: Db) {
  return db.query<{ id: number; at: Date; kind: string; message: string; contact: string | null; status: string }>(
    `select id, at, kind, message, contact, status from feedback order by (status = 'open') desc, at desc limit 300`,
  );
}

export async function closeFeedback(db: Db, id: number) {
  await db.query(`update feedback set status='closed' where id=$1`, [id]);
  return { ok: true };
}

export interface Support {
  /** A MoMo payment link, such as https://me.momo.vn/… */
  momo: string;
  /** A picture of a MoMo or bank QR code. */
  qr: string;
  /** A page that takes card payments (Ko-fi, Buy Me a Coffee, PayPal…). */
  card: string;
  /** A short thank-you line shown above the options. */
  note: string;
}

const httpsOnly = (v: unknown) => {
  const s = String(v ?? '').trim().slice(0, 400);
  if (!s) return '';
  try {
    const u = new URL(s);
    return u.protocol === 'https:' ? u.toString() : '';
  } catch {
    return '';
  }
};

export async function getSupport(db: Db): Promise<Support> {
  const [row] = await db.query<{ value: string }>(`select value from meta where key='support'`);
  const empty: Support = { momo: '', qr: '', card: '', note: '' };
  if (!row) return empty;
  try {
    return { ...empty, ...JSON.parse(row.value) };
  } catch {
    return empty;
  }
}

export async function setSupport(db: Db, a: Partial<Support>) {
  const v: Support = { momo: httpsOnly(a.momo), qr: httpsOnly(a.qr), card: httpsOnly(a.card), note: String(a.note ?? '').trim().slice(0, 200) };
  await db.query(`insert into meta (key, value) values ('support', $1) on conflict (key) do update set value=excluded.value`, [JSON.stringify(v)]);
  return v;
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
type DayScores = Map<string, { score: number; grid: string }>;
const dayCache = new Map<string, { at: number; scores: DayScores }>();
/** How long one server instance trusts what it last read. */
const MEM_MS = 10_000;
/** How often the day is recomputed, by whichever instance claims it first. */
const DB_FRESH_S = 30;

/**
 * Everyone's score for the day, recomputed at most every 30 seconds across all server instances and kept in
 * the database, so a busy evening costs one recompute per half minute instead of one per finished flight.
 */
export async function scoreDay(db: Db, day: string): Promise<DayScores> {
  const hit = dayCache.get(day);
  if (hit && Date.now() - hit.at < MEM_MS) return hit.scores;
  await db.query(`insert into day_scores (day) values ($1::date) on conflict do nothing`, [day]);
  const [row] = await db.query<{ data: Record<string, [number, string]> | string; age: number; final: boolean }>(
    `select data, extract(epoch from now() - computed_at)::float8 as age, final from day_scores where day=$1::date`,
    [day],
  );
  const parse = (d: Record<string, [number, string]> | string): DayScores => {
    const o = (typeof d === 'string' ? JSON.parse(d) : d) as Record<string, [number, string]>;
    return new Map(Object.entries(o ?? {}).map(([k, v]) => [k, { score: v[0], grid: v[1] }]));
  };
  let scores: DayScores;
  if (row && (row.final || row.age < DB_FRESH_S)) {
    scores = parse(row.data);
  } else {
    const claimed = await db.query(
      `update day_scores set claimed_at = now() where day=$1::date and claimed_at < now() - interval '15 seconds' returning 1`,
      [day],
    );
    if (claimed.length || !row || row.age > 3600) {
      scores = await computeScores(db, day);
      const data = Object.fromEntries([...scores].map(([k, v]) => [k, [v.score, v.grid]]));
      await db.query(`update day_scores set data=$2::jsonb, computed_at=now(), final=$3 where day=$1::date`, [day, JSON.stringify(data), day < vnToday()]);
    } else {
      // Another instance is recomputing right now: the last result, at most a minute old, will do.
      scores = parse(row.data);
    }
  }
  dayCache.set(day, { at: Date.now(), scores });
  return scores;
}

/** Scores from the day's answers and current counts; for one player only when an id is given (cheap). */
export async function computeScores(db: Db, day: string, playerId?: string): Promise<DayScores> {
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
    playerId
      ? `select player_id, question_id, answer_key, tier from turns where day=$1::date and mode='daily' and answered_at is not null and player_id=$2 order by answered_at`
      : `select player_id, question_id, answer_key, tier from turns where day=$1::date and mode='daily' and answered_at is not null order by answered_at`,
    playerId ? [day, playerId] : [day],
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
    // An answer removed from the book after it was given no longer scores.
    if (!entry) {
      p.streak = 0;
      p.tiers.set(t.question_id, -1);
      continue;
    }
    const c = counts.get(q.id)?.get(t.answer_key) ?? 1;
    // The player's own answer is in the counts; score it as the crowd minus themselves, as at answer time.
    const tier = tierFor(q, t.answer_key, entry.prior, Math.max(0, c - 1), Math.max(0, (totals.get(q.id) ?? 1) - 1));
    p.streak = isRare(tier) ? p.streak + 1 : 0;
    p.score += TIERS[tier].points + streakBonus(p.streak);
    p.tiers.set(t.question_id, tier);
  }
  const scores: DayScores = new Map();
  for (const [pid, p] of by) {
    scores.set(pid, { score: p.score, grid: set.map((id) => { const t = p.tiers.get(id); return t == null || t < 0 ? 'x' : String(t); }).join('') });
  }
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
async function standings(db: Db, day: string, mode: Mode, own?: { playerId: string; score: number; grid: string }): Promise<Standing[]> {
  const runs = await db.query<{ player_id: string; name: string | null; score: number; altitude: number; grid: string; dev: string | null; fresh: boolean | null }>(
    `select player_id, name, score, altitude, grid, dev, fresh from runs where day=$1::date and mode=$2 order by created_at asc`,
    [day, mode],
  );
  const scores = mode === 'daily' ? new Map(await scoreDay(db, day)) : null;
  if (scores && own) scores.set(own.playerId, { score: own.score, grid: own.grid });
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
    // The player's own score is always fresh; everyone else's comes from the shared half-minute recompute.
    const s = (await computeScores(db, a.day, a.playerId)).get(a.playerId);
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
  const all = await standings(db, a.day, a.mode, a.mode === 'daily' ? { playerId: a.playerId, score, grid } : undefined);
  const me = all.find((r) => r.player_id === a.playerId);
  const ranked = all.filter((r) => !r.replay);
  const above = ranked.filter((r) => r.altitude > altitude).length;
  const total = ranked.length + (me?.replay ? 1 : 0);
  const beaten = total > 1 ? Math.round(((total - above - 1) / (total - 1)) * 100) : 100;
  const settled = a.day < vnToday();
  // How the day's scores spread, for the curve on the result screen: counts per bucket of points, no names.
  const top = Math.max(score, ...ranked.map((r) => r.score));
  const w = a.mode === 'daily' ? 20 : Math.max(20, Math.ceil(top / 40 / 10) * 10);
  const counts = new Array(Math.max(42, Math.ceil((top + 1) / w))).fill(0);
  for (const r of ranked) counts[Math.min(counts.length - 1, Math.floor(Math.max(0, r.score) / w))]++;
  if (me?.replay) counts[Math.min(counts.length - 1, Math.floor(score / w))]++;
  return {
    score,
    altitude,
    grid,
    rank: above + 1,
    players: total,
    beaten,
    dist: { w, counts },
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
