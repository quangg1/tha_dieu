import { createHash } from 'node:crypto';
import { BANKS } from '../shared/banks.js';
import { BOOK, BOOK_BY_ID, BOOK_VERSION, RETIRED } from '../shared/book/questions.js';
import type { NightVerdict } from '../shared/book/night-verdicts.js';
import { Matcher, namesBrands } from '../shared/match.js';
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
import { nullReferee, type Ai, type Referee, type Verdict } from './referee.js';
import { SCHEMA } from './schema.js';
import { WIKI_RULES, wikiCheck } from './wikidata.js';

export class GameError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export const DAILY_COUNT = 7;
/** Seconds a daily turn may stay open: the wind, the referee's think time and network slack. */
const TURN_GRACE_SECONDS = QUESTION_SECONDS + 10 + 15;
const REFEREE_CALLS_PER_DAY = 10;
/** Share of a player's referee calls turned down, after a few, past which their new answers wait for the night shift. */
const REFUSED_SHARE_LIMIT = 0.6;
/** Referee calls one network may spend in a day, whatever player ids it invents. */
const REFEREE_CALLS_PER_NET = 60;
/** Players from one network whose answers count towards the day's rarity. A school or a café shares an address; a script does too. */
const NET_PLAYERS_COUNTED = 60;
/** Answers the book did not know that one player may leave for the night shift in a day. */
const ASKS_PER_DAY = 40;

/* ------------------------------------------------------------------ setup */

/**
 * Creates tables and syncs the questions table with the village book. Answers live in code (the book);
 * the database only keeps what players and the village head add, plus counts. Safe to run again.
 */
/** Book and table layout together: a change to either makes the next server instance run setup again. */
export const DB_VERSION = `${BOOK_VERSION}.${createHash('sha256').update(SCHEMA).digest('hex').slice(0, 10)}`;

export async function setup(db: Db) {
  // A new deploy wakes several instances at once and each runs setup; the layout changes take table-wide
  // locks, so two of them at the same moment deadlock. One lock for the whole layout makes them take turns.
  await db.execLocked(7151, SCHEMA);
  const ids = BOOK.map((q) => q.id);
  await db.query(
    `insert into questions (id, category, prompt, note, strip, krill_key, active)
     select id, c, p, nullif(n, ''), string_to_array(st, ' '), k, a = 'y'
     from unnest($1::text[], $2::text[], $3::text[], $4::text[], $5::text[], $6::text[], $7::text[]) as x(id, c, p, n, st, k, a)
     on conflict (id) do update set category=excluded.category, prompt=excluded.prompt, note=excluded.note,
       strip=excluded.strip, krill_key=excluded.krill_key, active=excluded.active`,
    [
      ids,
      BOOK.map((q) => q.category),
      BOOK.map((q) => q.prompt),
      BOOK.map((q) => q.note ?? ''),
      BOOK.map((q) => q.strip.join(' ')),
      BOOK.map((q) => q.krillKey),
      // Sent as text: the Postgres driver does not pass a boolean array.
      BOOK.map((q) => (RETIRED.has(q.id) ? 'n' : 'y')),
    ],
  );
  await db.query(`update questions set active=false where not (id = any($1::text[]))`, [ids]);
  await db.query(
    `insert into meta (key, value) values ('book_version', $1) on conflict (key) do update set value=excluded.value`,
    [DB_VERSION],
  );
  const [{ n }] = await db.query<{ n: number }>(`select count(*)::int as n from questions where active`);
  return { questions: n, version: DB_VERSION };
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

const OPEN_PER_DAY = 2;

/**
 * Prompts whose answers the book often does not know: by the share of unknown answers players typed, or, before
 * anyone has played them, by a very large answer space.
 */
async function openPrompts(db: Db, pool: readonly { id: string; answers: readonly unknown[] }[]) {
  const rows = await db.query<{ id: string; known: number; unknown: number }>(
    `select q.id, coalesce(t.n, 0)::int as known, coalesce(s.n, 0)::int as unknown from questions q
     left join (select question_id, count(*) as n from turns where answered_at is not null and tier >= 0 group by 1) t on t.question_id = q.id
     left join (select question_id, sum(n) as n from submissions group by 1) s on s.question_id = q.id`,
  );
  const stats = new Map(rows.map((r) => [r.id, r]));
  const open = new Set<string>();
  for (const q of pool) {
    const r = stats.get(q.id);
    const seen = r ? r.known + r.unknown : 0;
    if (seen >= 15 ? r!.unknown / seen > 0.2 : q.answers.length > 160) open.add(q.id);
  }
  return open;
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
  // Open prompts (many answers the book does not know yet) still come round, so players can fill them in,
  // but at most OPEN_PER_DAY a day, so a day is never mostly answers waiting for confirmation.
  const open = await openPrompts(db, pool);
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
        (!open.has(q.id) || pick.filter((p) => open.has(p.id)).length < OPEN_PER_DAY) &&
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
  answers: Map<string, { display: string; prior: number; status: string; source?: string }>;
  matcher: Matcher;
  vague: Set<string>;
  traps: Set<string>;
}

const unvouched = (e: { status: string; source?: string }) => e.status === 'pending' && e.source === 'crowd';

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
  const answers = new Map<string, { display: string; prior: number; status: string; source?: string }>(base.answers.map((a) => [a.key, { display: a.display, prior: a.priorTier, status: 'approved', source: 'seed' }]));
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
      answers.set(key, { display: l.display, prior: l.prior_tier, status: l.status, source: l.source });
      // A crowd answer nobody has vouched for (from before answers stopped waiting) keeps its old turns' names, but is not matched.
      if (!unvouched(answers.get(key)!)) entries.push({ key, aliases: [l.display], priorTier: l.prior_tier });
    }
  }
  const matcher = new Matcher(base.strip, entries.filter((e) => answers.has(e.key)), namesBrands(base.id));
  const al = await db.query<{ alias: string; key: string }>(`select alias, key from aliases where question_id=$1`, [id]);
  for (const a of al) {
    const key = rekey.get(a.key) ?? a.key;
    const e = answers.get(key);
    if (e && !unvouched(e)) matcher.addAlias(a.alias, key, e.prior);
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

/* ------------------------------------------------------------------ the hidden answer, day by day */

const krillCache = new Map<string, string>();

/**
 * The hidden answer for a prompt on a day. The first time a prompt is asked it is the book's; every later
 * appearance picks a new one among the rarest answers nobody has given and that was never hidden before,
 * because yesterday's hidden answer was shown to everyone who finished.
 */
export async function krillFor(db: Db, day: string, q: LoadedQuestion): Promise<string> {
  const ck = `${day}:${q.id}`;
  const c = krillCache.get(ck);
  if (c) return c;
  let [row] = await db.query<{ krill_key: string }>(`select krill_key from daily_krill where day=$1::date and question_id=$2`, [day, q.id]);
  if (!row) {
    const [seen] = await db.query<{ seen: boolean }>(
      `select exists (select 1 from daily_sets where day < $1::date and $2 = any(question_ids))
           or exists (select 1 from daily_krill where day < $1::date and question_id = $2) as seen`,
      [day, q.id],
    );
    let pick = q.krillKey;
    if (seen?.seen) {
      const used = new Set((await db.query<{ krill_key: string }>(`select krill_key from daily_krill where question_id=$1`, [q.id])).map((r) => r.krill_key));
      used.add(q.krillKey);
      const t = (await tallies(db, day, [q.id])).get(q.id)!;
      const cands = [...q.answers.entries()]
        .filter(([k, a]) => a.status === 'approved' && a.prior >= 4 && !used.has(k) && !q.traps.has(k))
        .map(([k]) => ({ k, n: (t.hist.get(k) ?? 0) + (t.today.get(k) ?? 0) }));
      if (cands.length) {
        const least = Math.min(...cands.map((x) => x.n));
        const pool = cands.filter((x) => x.n === least).map((x) => x.k).sort();
        const h = createHash('sha256').update(`${day}:${q.id}`).digest().readUInt32BE(0);
        pick = pool[h % pool.length];
      }
    }
    await db.query(`insert into daily_krill (day, question_id, krill_key) values ($1::date,$2,$3) on conflict do nothing`, [day, q.id, pick]);
    [row] = await db.query<{ krill_key: string }>(`select krill_key from daily_krill where day=$1::date and question_id=$2`, [day, q.id]);
  }
  krillCache.set(ck, row.krill_key);
  return row.krill_key;
}

/** The prompt as it is played on a day: the same book, with that day's hidden answer. */
export async function dayQuestion(db: Db, day: string, id: string): Promise<LoadedQuestion> {
  const q = await loadQuestion(db, id);
  const krillKey = await krillFor(db, day, q);
  return krillKey === q.krillKey ? q : { ...q, krillKey };
}

/** One prompt's counts: today's players, and every earlier day (history), answer by answer. */
export interface Tally {
  today: Map<string, number>;
  todayTotal: number;
  hist: Map<string, number>;
  histTotal: number;
}

export async function tallies(db: Db, day: string, ids: string[]): Promise<Map<string, Tally>> {
  const [all, today] = await Promise.all([
    db.query<{ question_id: string; answer_key: string; n: number }>(`select question_id, answer_key, n from counts where question_id = any($1::text[])`, [ids]),
    db.query<{ question_id: string; answer_key: string; n: number }>(`select question_id, answer_key, n from day_counts where day=$1::date and question_id = any($2::text[])`, [day, ids]),
  ]);
  const out = new Map<string, Tally>(ids.map((id) => [id, { today: new Map(), todayTotal: 0, hist: new Map(), histTotal: 0 }]));
  for (const r of today) {
    const t = out.get(r.question_id)!;
    t.today.set(r.answer_key, r.n);
    t.todayTotal += r.n;
  }
  for (const r of all) {
    const t = out.get(r.question_id)!;
    const h = Math.max(0, r.n - (t.today.get(r.answer_key) ?? 0));
    if (!h) continue;
    t.hist.set(r.answer_key, h);
    t.histTotal += h;
  }
  return out;
}

/** Earlier days count only once they hold enough players to say something. */
const HIST_MIN = 30;

/**
 * The tier of an answer, fixed for the whole day: the book's prior, corrected by what players gave on earlier days.
 * Today's players never move it, so a score is final the moment the answer lands (as in Krillion), and playing
 * early or late makes no difference. Today's counts teach tomorrow.
 */
function tierFromTally(q: Pick<LoadedQuestion, 'krillKey' | 'traps'>, key: string, prior: number, t: Tally): TierIndex {
  // Earlier days count only once they hold enough players to say something.
  if (t.histTotal < HIST_MIN) return tierFor(q, key, prior);
  return tierFor(q, key, prior, t.hist.get(key) ?? 0, t.histTotal);
}

/** Uses the cached verdict, or asks the referee (within the player's daily budget), for an answer the bank does not know. */
/** Looks like a name: letters, at most a few words, not a run of one key. */
function plausible(input: string) {
  const t = input.trim();
  if (norm(t).length < 2 || t.length > 40 || t.split(/\s+/).length > 6) return false;
  if (!/\p{L}/u.test(t) || /(.)\1{3,}/u.test(norm(t))) return false;
  const words = norm(t.replace(/\s+/g, '|')).length ? t.toLowerCase().split(/\s+/) : [];
  if (words.length >= 3 && new Set(words).size === 1) return false;
  return /^[\p{L}\p{N}\s'’.\-&+#]+$/u.test(t);
}

/** Capital first letter, single spaces. */
const tidy = (s: string) => {
  const t = s.trim().replace(/\s+/g, ' ').slice(0, 60);
  return t.charAt(0).toUpperCase() + t.slice(1);
};

/** Adds an answer to the question's book (or reuses a matching one) and remembers the typed form as an alias. */
async function learnAnswer(db: Db, q: LoadedQuestion, input: string, display: string, source: string, status: 'approved' | 'pending', prior: number, reason: string | null) {
  const inputKey = soft(input);
  const m = q.matcher.match(display);
  const known = m?.exact ? m : null;
  const key = known?.key ?? soft(display);
  if (!known) {
    await db.query(
      `insert into answers (question_id, key, display, prior_tier, source, status) values ($1,$2,$3,$4,$5,$6)
       on conflict (question_id, key) do update set status=excluded.status, source=excluded.source, display=excluded.display
       where answers.status='pending' and excluded.status='approved'`,
      [q.id, key, display, prior, source, status],
    );
    const had = q.answers.get(key);
    if (!had || (unvouched(had) && status === 'approved')) q.answers.set(key, { display, prior: had?.prior ?? prior, status, source });
  }
  await db.query(`insert into aliases (question_id, alias, key) values ($1,$2,$3), ($1,$4,$3) on conflict do nothing`, [q.id, inputKey, key, soft(display)]);
  q.matcher.addAlias(input, key);
  q.matcher.addAlias(display, key);
  if (status === 'approved') {
    // Approval overwrites an earlier refusal: this is how a second look by the night shift corrects the referee.
    await db.query(
      `insert into verdicts (question_id, input_key, valid, canonical_key, reason) values ($1,$2,true,$3,$4)
       on conflict (question_id, input_key) do update set valid=true, canonical_key=excluded.canonical_key, reason=excluded.reason`,
      [q.id, inputKey, key, reason],
    );
  }
  return { key, reason: '' };
}

/** How long a player waits for the referee before the answer stands as new; the kite's climb covers the wait. */
const inlineMs = () => Number(process.env.REFEREE_INLINE_MS) || 3500;

/** Work that finishes after the reply: kept alive on Vercel, tracked here so tests can wait for it. */
const inflight = new Set<Promise<unknown>>();
export function background(p: Promise<unknown>) {
  const t = p.catch((e) => console.error('background', e)).finally(() => inflight.delete(t));
  inflight.add(t);
  if (process.env.VERCEL) import('@vercel/functions').then((m) => m.waitUntil(t)).catch(() => {});
}
export async function settleAll() {
  while (inflight.size) await Promise.all([...inflight]);
}

const sleep = (ms: number) => new Promise<null>((r) => setTimeout(() => r(null), ms));

/** Referee calls in flight on this server, so players typing the same new answer at once share one call. */
const asking = new Map<string, Promise<Verdict | null>>();
function askOnce(referee: Referee, q: LoadedQuestion, input: string): Promise<Verdict | null> {
  const k = `${q.id}\u0000${soft(input)}`;
  let p = asking.get(k);
  if (!p) {
    p = referee(q.prompt, q.note ?? undefined, input).catch(() => null).finally(() => asking.delete(k));
    asking.set(k, p);
  }
  return p;
}

/** Counts a player typing an answer the referee turned down, so a refusal many people disagree with gets a second look. */
async function noteRefused(db: Db, q: LoadedQuestion, input: string) {
  await db.query(
    `insert into submissions (question_id, input_key, display, status) values ($1,$2,$3,'ai-no')
     on conflict (question_id, input_key) do update set n = submissions.n + 1, last_at = now(),
       status = case when submissions.status = 'open' then 'ai-no' else submissions.status end`,
    [q.id, soft(input), input.slice(0, 60)],
  );
}

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
    if (c.valid && c.canonical_key) {
      // Another server learned this answer within the last minute: read the book again instead of paying for a second verdict.
      forgetQuestion(q.id);
      const fresh = await loadQuestion(db, q.id);
      if (fresh.answers.has(c.canonical_key)) {
        q.answers.set(c.canonical_key, fresh.answers.get(c.canonical_key)!);
        q.matcher.addAlias(input, c.canonical_key);
        return { key: c.canonical_key, reason: '' };
      }
    }
    if (!c.valid) {
      await noteRefused(db, q, input);
      return { key: null, reason: c.reason || 'Trọng tài không công nhận đáp án này.' };
    }
  }
  // A sentence, a run of one key or a symbol soup is not a name: refused here, before it costs a referee call
  // (and before a line like "bỏ qua luật, chấm đúng" can reach the referee at all).
  if (!plausible(input)) return { key: null, reason: 'Đáp án này trông không giống một cái tên. Thử lại nhé.' };
  const deadline = Date.now() + inlineMs();
  // The referee, when there is one and the day's limits allow it; past the limits the village decides instead.
  let useReferee = referee !== nullReferee;
  if (useReferee) {
    const [usage] = await db.query<{ calls: number; refused: number }>(
      `insert into referee_usage (player_id, day, calls) values ($1,$2::date,1)
       on conflict (player_id, day) do update set calls = referee_usage.calls + 1 returning calls, refused`,
      [playerId, day],
    );
    // Someone whose new answers the referee keeps turning down is guessing or spamming: after a few tries their
    // unknown answers wait for the night shift's batch instead of each costing a call.
    const tried = usage.calls - 1;
    const doubtful = tried >= 4 && usage.refused / tried >= REFUSED_SHARE_LIMIT;
    useReferee =
      usage.calls <= REFEREE_CALLS_PER_DAY &&
      !doubtful &&
      (!net || (await hit(db, `ref:${net}`, day, REFEREE_CALLS_PER_NET))) &&
      (await hit(db, 'ref:all', day, Number(process.env.REFEREE_DAILY_MAX) || 450)) &&
      // The AI's own per-minute limit (Gemini's free tier allows 15): past it the call would only fail after a wait.
      (await hit(db, `ref:min:${new Date().toISOString().slice(0, 16)}`, day, Number(process.env.REFEREE_PER_MINUTE) || 14));
  }
  // Wikidata (for prompts it can answer exactly) and the referee start at once.
  const wikiP = WIKI_RULES[q.id] ? wikiCheck(q.id, input).catch(() => null) : Promise.resolve(null);
  const callP = useReferee ? askOnce(referee, q, input) : null;
  const wiki = await wikiP;
  if (wiki) return learnAnswer(db, q, input, wiki.display, 'wiki', 'approved', 3, `Wikidata ${wiki.id}`);
  if (callP) {
    const first = await Promise.race([callP.then((v) => ({ v })), sleep(Math.max(300, deadline - Date.now()))]);
    if (first && first.v) {
      const r = await applyVerdict(db, q, input, first.v);
      if (!r.key) await db.query(`update referee_usage set refused = refused + 1 where player_id=$1 and day=$2::date`, [playerId, day]);
      return r;
    }
    if (!first) {
      // The referee is slow today: this try does not count, and its verdict, when it comes, teaches the book, so the
      // same answer sent again a moment later is read from the verdict instead of asked twice.
      background(callP.then((v) => (v ? applyVerdict(db, q, input, v).then(() => creditLearned(db, q.id)) : null)));
      // Still noted for this player, so they hear about it on their next visit if they moved on.
      await notInBook(db, q, input, playerId, day);
      return { key: null, reason: `Trọng tài đang xem “${input.slice(0, 40)}”. Bấm Thả lại sau một giây, hoặc thử đáp án khác.` };
    }
  }
  return notInBook(db, q, input, playerId, day);
}

/**
 * The book does not know this answer and nobody could vouch for it in time. As in Krillion, nothing is left
 * waiting: the player tries another answer while the wind lasts, and the night shift reads what was typed.
 * If it turns out right, the book learns it and the player hears about it on their next visit.
 */
async function notInBook(db: Db, q: LoadedQuestion, input: string, playerId: string, day: string) {
  if (!plausible(input)) return { key: null, reason: 'Đáp án này trông không giống một cái tên. Thử lại nhé.' };
  const inputKey = soft(input);
  await db.query(
    `insert into submissions (question_id, input_key, display) values ($1,$2,$3)
     on conflict (question_id, input_key) do update set n = submissions.n + 1, last_at = now()`,
    [q.id, inputKey, input.slice(0, 60)],
  );
  if (await hit(db, `ask:${playerId}`, day, ASKS_PER_DAY)) {
    await db.query(
      `insert into asks (player_id, question_id, input_key, display, day) values ($1,$2,$3,$4,$5::date) on conflict do nothing`,
      [playerId, q.id, inputKey, input.slice(0, 60), day],
    );
  }
  return { key: null, reason: `Sổ của làng chưa có “${input.slice(0, 40)}”. Thử đáp án khác nhé, bé Bi đã ghi lại cho ca đêm xem.` };
}

/** Answers this player typed that the book did not know then but has learned since; each is told once. */
/**
 * An answer a player typed on a daily flight, refused then because nobody could vouch for it, has since been
 * approved (night shift, a late referee verdict, a second look). The player gets its points on that day's flight,
 * as if it had been known then: the turn takes the better of what it had and the approved answer, and the day's
 * scores are recomputed so the board shows it. Thả vô tận runs keep their best score as flown.
 */
export async function creditLearned(db: Db, questionId: string) {
  const rows = await db.query<{ player_id: string; input_key: string; display: string; day: string }>(
    `select player_id, input_key, display, to_char(day,'YYYY-MM-DD') as day from asks
     where question_id=$1 and credited is null and day >= current_date - 14`,
    [questionId],
  );
  if (!rows.length) return 0;
  forgetQuestion(questionId);
  const q = await loadQuestion(db, questionId);
  const days = new Set<string>();
  let n = 0;
  for (const r of rows) {
    const m = q.matcher.match(r.display);
    let key = m?.exact ? m.key : null;
    if (!key) {
      const [v] = await db.query<{ valid: boolean; canonical_key: string | null }>(`select valid, canonical_key from verdicts where question_id=$1 and input_key=$2`, [questionId, r.input_key]);
      if (v && !v.valid) {
        await db.query(`update asks set credited=0 where player_id=$1 and question_id=$2 and input_key=$3`, [r.player_id, questionId, r.input_key]);
        continue;
      }
      key = v?.valid ? v.canonical_key : null;
    }
    const entry = key ? q.answers.get(key) : undefined;
    if (!key || !entry || entry.status === 'rejected') continue;
    const dq = await dayQuestion(db, r.day, questionId);
    const tally = (await tallies(db, r.day, [questionId])).get(questionId)!;
    const tier = tierFromTally(dq, key, entry.prior, tally);
    const points = TIERS[tier].points;
    // Only a daily turn that scored less than this answer is worth changing.
    const up = await db.query(
      `update turns set answer_key=$5, tier=$6, points=$7, answered_at=coalesce(answered_at, now())
       where player_id=$1 and day=$2::date and mode='daily' and question_id=$3 and coalesce(points, 0) < $4 and coalesce(tier, -1) <> $6
       returning 1`,
      [r.player_id, r.day, questionId, points, key, tier, points],
    );
    await db.query(`update asks set credited=$4 where player_id=$1 and question_id=$2 and input_key=$3`, [r.player_id, questionId, r.input_key, up.length ? points : 0]);
    if (up.length) {
      days.add(r.day);
      n++;
    }
  }
  for (const d of days) {
    // The day's cached scores are stale now, even a finished day's.
    await db.query(`update day_scores set final=false, computed_at='epoch' where day=$1::date`, [d]);
    dayCache.delete(d);
    const scores = await computeScores(db, d);
    for (const r of rows) {
      if (r.day !== d) continue;
      const s2 = scores.get(r.player_id);
      if (s2) await db.query(`update runs set score=$3, altitude=$4, grid=$5 where player_id=$1 and day=$2::date and mode='daily'`, [r.player_id, d, s2.score, altitudeFor(s2.score), s2.grid]);
    }
  }
  return n;
}

export async function notices(db: Db, playerId: string) {
  const rows = await db.query<{ question_id: string; input_key: string; display: string; credited: number | null }>(
    `select question_id, input_key, display, credited from asks where player_id=$1 and not told and day >= current_date - 14 order by day desc limit 40`,
    [playerId],
  );
  const out: { questionId: string; prompt: string; typed: string; answer: string; points: number }[] = [];
  const told: string[][] = [];
  for (const r of rows) {
    const base = BOOK_BY_ID.get(r.question_id);
    if (!base) continue;
    const q = await loadQuestion(db, r.question_id);
    const m = q.matcher.match(r.display);
    const [v] = m?.exact ? [] : await db.query<{ valid: boolean; canonical_key: string | null }>(`select valid, canonical_key from verdicts where question_id=$1 and input_key=$2`, [r.question_id, r.input_key]);
    const key = m?.exact ? m.key : v?.valid ? v.canonical_key : null;
    if (v && !v.valid) told.push([r.question_id, r.input_key]);
    const entry = key ? q.answers.get(key) : undefined;
    if (!entry || entry.status === 'rejected') continue;
    told.push([r.question_id, r.input_key]);
    if (out.length < 5) out.push({ questionId: r.question_id, prompt: q.prompt, typed: r.display, answer: entry.display, points: r.credited ?? 0 });
  }
  if (told.length) {
    await db.query(
      `update asks set told=true where player_id=$1 and (question_id, input_key) in (select * from unnest($2::text[], $3::text[]))`,
      [playerId, told.map((t) => t[0]), told.map((t) => t[1])],
    );
  }
  return { learned: out };
}

/** The referee answered in time: the answer is in or out right away. */
async function applyVerdict(db: Db, q: LoadedQuestion, input: string, v: Verdict) {
  const inputKey = soft(input);
  const refuse = async (reason: string) => {
    await db.query(`insert into verdicts (question_id, input_key, valid, reason) values ($1,$2,false,$3) on conflict do nothing`, [q.id, inputKey, reason]);
    await noteRefused(db, q, input);
    return { key: null as string | null, reason };
  };
  if (!v.valid) return refuse(v.reason || 'Trọng tài không công nhận đáp án này.');
  // "Chim" for a bird question is too general, whoever says it is fine.
  if (q.vague.has(soft(v.canonical)) || q.vague.has(norm(v.canonical))) return refuse(`“${v.canonical}” chung chung quá. Hãy kể tên một thứ cụ thể hơn.`);
  // Only an exact name joins an existing answer: a near spelling of a different answer must not swallow it.
  const known = q.matcher.match(v.canonical);
  const sure = known?.exact ? known : null;
  const key = sure?.key ?? soft(v.canonical);
  // The village head took this answer out of the book: the referee does not bring it back.
  const [gone] = await db.query<{ status: string }>(`select status from answers where question_id=$1 and key=$2 and status='rejected'`, [q.id, key]);
  if (gone) return refuse('Ban quản lý đã gỡ đáp án này khỏi sổ.');
  if (!sure) {
    await db.query(
      `insert into answers (question_id, key, display, prior_tier, source, status) values ($1,$2,$3,4,'claude','pending') on conflict do nothing`,
      [q.id, key, v.canonical],
    );
    // In the book at once; it stays on the village head's review list (source 'claude' is never scored down).
    q.answers.set(key, { display: v.canonical, prior: 4, status: 'pending', source: 'claude' });
  }
  await db.query(`insert into aliases (question_id, alias, key) values ($1,$2,$3), ($1,$4,$3) on conflict do nothing`, [q.id, inputKey, key, soft(v.canonical)]);
  q.matcher.addAlias(input, key);
  q.matcher.addAlias(v.canonical, key);
  await db.query(
    `insert into verdicts (question_id, input_key, valid, canonical_key, reason) values ($1,$2,true,$3,$4) on conflict do nothing`,
    [q.id, inputKey, key, v.reason],
  );
  return { key, reason: '' };
}

/**
 * A late verdict on an answer that stood as new: approve it, fold it into the book answer it really is,
 * or take it out (the player's turn then scores nothing, shown on the result screen).
 */
export async function settle(db: Db, questionId: string, input: string, key: string, v: Verdict | null) {
  if (!v) return 'pending';
  const inputKey = soft(input);
  const q = await loadQuestion(db, questionId);
  if (!v.valid) {
    await db.query(`update answers set status='rejected' where question_id=$1 and key=$2 and status='pending' and source='crowd'`, [questionId, key]);
    await db.query(
      `insert into verdicts (question_id, input_key, valid, reason) values ($1,$2,false,$3)
       on conflict (question_id, input_key) do update set valid=false, canonical_key=null, reason=excluded.reason`,
      [questionId, inputKey, v.reason || 'Trọng tài không công nhận đáp án này.'],
    );
    forgetQuestion(questionId);
    return 'rejected';
  }
  const m = q.matcher.match(v.canonical);
  const known = m?.exact ? m : null;
  const target = known && known.key !== key && q.answers.get(known.key)?.status === 'approved' ? known.key : key;
  if (target !== key) {
    // "chim sao sau" was "Sáo sậu" all along: move its turns and counts onto the book's answer.
    await db.query(`insert into aliases (question_id, alias, key) values ($1,$2,$3) on conflict (question_id, alias) do update set key=excluded.key`, [questionId, inputKey, target]);
    await db.query(`update turns set answer_key=$3 where question_id=$1 and answer_key=$2`, [questionId, key, target]);
    await db.query(
      `insert into counts (question_id, answer_key, n) select question_id, $3, n from counts where question_id=$1 and answer_key=$2
       on conflict (question_id, answer_key) do update set n = counts.n + excluded.n`,
      [questionId, key, target],
    );
    await db.query(`delete from counts where question_id=$1 and answer_key=$2`, [questionId, key]);
    await db.query(
      `insert into day_counts (day, question_id, answer_key, n) select day, question_id, $3, n from day_counts where question_id=$1 and answer_key=$2
       on conflict (day, question_id, answer_key) do update set n = day_counts.n + excluded.n`,
      [questionId, key, target],
    );
    await db.query(`delete from day_counts where question_id=$1 and answer_key=$2`, [questionId, key]);
    await db.query(`update answers set status='rejected' where question_id=$1 and key=$2 and status='pending' and source='crowd'`, [questionId, key]);
  } else {
    await db.query(`update answers set status='approved', source='ai', display=$3 where question_id=$1 and key=$2 and status='pending'`, [questionId, key, v.canonical || tidy(input)]);
    await db.query(`insert into aliases (question_id, alias, key) values ($1,$2,$3) on conflict do nothing`, [questionId, soft(v.canonical), key]);
  }
  await db.query(
    `insert into verdicts (question_id, input_key, valid, canonical_key, reason) values ($1,$2,true,$3,$4)
     on conflict (question_id, input_key) do update set valid=true, canonical_key=excluded.canonical_key, reason=excluded.reason`,
    [questionId, inputKey, target, v.reason],
  );
  forgetQuestion(questionId);
  return 'approved';
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
  /** A new answer the village has not confirmed yet: it scores today, and keeps its points only once confirmed. */
  pending?: boolean;
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

/** What the village answered today once enough have played; before that, earlier days or the book's guess. */
export function crowdFrom(q: LoadedQuestion, key: string | null, t: Tally): Crowd {
  const rows = [...t.today.entries()].sort((x, y) => y[1] - x[1]);
  const total = t.todayTotal;
  if (total >= CROWD_MIN) {
    const pct = (n: number) => Math.round((n / total) * 1000) / 10;
    const top = rows.slice(0, 4).map(([k, n]) => ({ display: q.answers.get(k)?.display ?? k, pct: pct(n), mine: k === key }));
    const mineRow = rows.find(([k]) => k === key);
    return { total, top, mine: mineRow ? pct(mineRow[1]) : 0, estimated: false };
  }
  const fromHistory = t.histTotal >= CROWD_MIN
    ? [...t.hist.entries()].filter(([k]) => k !== q.krillKey && q.answers.has(k)).sort((x, y) => y[1] - x[1]).map(([k]) => k)
    : [...q.answers.entries()].filter(([k, a]) => a.status === 'approved' && k !== q.krillKey).sort((x, y) => x[1].prior - y[1].prior).map(([k]) => k);
  const guess = fromHistory.slice(0, 4).map((k) => ({ display: q.answers.get(k)!.display, pct: null, mine: k === key }));
  return { total, top: guess, mine: null, estimated: true };
}

/** Players on earlier days before history can call an answer Khôn lỏi on its own. */
const KHON_LOI_MIN_PLAYERS = 30;

/**
 * The tier an answer lands at, from the book's prior and (when given) the share earlier days measured. Besides plain
 * rarity, an answer the book expected to be uncommon but that many players give is Khôn lỏi: the pick that feels
 * clever but that half the village reaches for. The day's hidden answer is always Độc nhất: it changes every time
 * the prompt comes back, so it cannot be learned from a previous day.
 */
export function tierFor(q: Pick<LoadedQuestion, 'krillKey' | 'traps'>, key: string, prior: number, histCount = 0, histTotal = 0): TierIndex {
  if (key === q.krillKey) return CUNG_TRANG;
  // The book's estimate is worth a few imaginary players; earlier days' real players outweigh it as they add up.
  const base = tierFromCounts(prior, histCount, histTotal);
  const enough = histTotal >= KHON_LOI_MIN_PLAYERS;
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
  const q = await dayQuestion(db, a.day, a.questionId);
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
  const tally = (await tallies(db, a.day, [q.id])).get(q.id)!;
  const tier = tierFromTally(q, key, entry.prior, tally);
  const streak = isRare(tier) ? (await currentStreak(db, a)) + 1 : 0;
  const bonus = streakBonus(streak);
  const points = TIERS[tier].points + bonus;
  const updated = await db.query(
    `update turns set answered_at=now(), answer_key=$5, tier=$6, points=$7
     where player_id=$1 and day=$2::date and mode=$3 and question_id=$4 and answered_at is null returning 1`,
    [a.playerId, a.day, a.mode, a.questionId, key, tier, points],
  );
  if (!updated.length) throw new GameError(409, 'Bạn đã trả lời câu này rồi.');
  let mineCount = tally.today.get(key) ?? 0;
  let todayTotal = tally.todayTotal;
  if (a.mode === 'daily' && (await countable(db, a.net, a.day, a.playerId))) {
    await db.query(
      `insert into counts (question_id, answer_key, n) values ($1,$2,1) on conflict (question_id, answer_key) do update set n = counts.n + 1`,
      [q.id, key],
    );
    await db.query(
      `insert into day_counts (day, question_id, answer_key, n) values ($1::date,$2,$3,1) on conflict (day, question_id, answer_key) do update set n = day_counts.n + 1`,
      [a.day, q.id, key],
    );
    mineCount++;
    todayTotal++;
    tally.today.set(key, mineCount);
    tally.todayTotal = todayTotal;
  }
  const share = todayTotal >= 30 ? Math.round((mineCount / todayTotal) * 1000) / 10 : null;
  return { status: 'landed', input, display: entry.display, tier, points, bonus, judged, share, crowd: crowdFrom(q, key, tally) };
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

export const EVENT_NAMES = new Set(['open', 'invite', 'start', 'retry', 'miss', 'finish', 'share', 'challenge', 'challenge_open', 'lap', 'report', 'error', 'howto', 'bag', 'support', 'themes']);

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

/** Several events in one insert; unknown names are skipped rather than failing the batch. */
export async function logEvents(db: Db, day: string, playerId: string | undefined, events: { name: string; props?: unknown }[]) {
  const ok = events.filter((e) => EVENT_NAMES.has(e.name));
  if (!ok.length) return;
  const props = ok.map((e) => {
    if (!e.props || typeof e.props !== 'object') return null;
    const j = JSON.stringify(e.props);
    return j.length > 800 ? JSON.stringify({ cut: j.slice(0, 780) }) : j;
  });
  await db.query(
    `insert into events (day, name, player_id, props) select $1::date, n, $2, p::jsonb from unnest($3::text[], $4::text[]) as x(n, p)`,
    [day, playerId?.slice(0, 64) ?? null, ok.map((e) => e.name), props],
  );
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
  momo: string;
  qr: string;
  card: string;
  note: string;
  bank: string;
  account: string;
  holder: string;
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
  const empty: Support = { momo: '', qr: '', card: '', note: '', bank: '', account: '', holder: '' };
  if (!row) return empty;
  try {
    return { ...empty, ...JSON.parse(row.value) };
  } catch {
    return empty;
  }
}

export async function setSupport(db: Db, a: Partial<Support>) {
  const qr = String(a.qr ?? '').trim();
  // An uploaded picture comes as a small data URL; anything else must be an https link.
  const okQr = /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(qr) && qr.length <= 300_000 ? qr : httpsOnly(qr);
  const bank = BANKS.some((b) => b.bin === a.bank) ? String(a.bank) : '';
  const account = String(a.account ?? '').replace(/[^0-9A-Za-z]/g, '').slice(0, 20);
  const holder = String(a.holder ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toUpperCase().replace(/[^A-Z ]/g, '').replace(/\s+/g, ' ').trim().slice(0, 50);
  const v: Support = {
    momo: httpsOnly(a.momo),
    qr: okQr,
    card: httpsOnly(a.card),
    note: String(a.note ?? '').trim().slice(0, 200),
    bank: bank && account ? bank : '',
    account: bank && account ? account : '',
    holder: bank && account ? holder : '',
  };
  await db.query(`insert into meta (key, value) values ('support', $1) on conflict (key) do update set value=excluded.value`, [JSON.stringify(v)]);
  return v;
}

/** Records a question the wind ran out on. Nothing about the answers is revealed. */
export async function miss(db: Db, a: { playerId: string; day: string; mode: Mode; questionId: string }) {
  await closeTurn(db, a);
  return { ok: true };
}

/* ------------------------------------------------------------------ runs and board */

/** Daily scores for the board, summed from the stored turns and shared across server instances. */
type DayScores = Map<string, { score: number; grid: string }>;
const dayCache = new Map<string, { at: number; scores: DayScores; stamp: string }>();
/** How long one server instance trusts what it last read. */
const MEM_MS = 15_000;
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
  // Read only the stamp first: the scores themselves travel again only when another instance has recomputed them.
  const [row] = await db.query<{ stamp: string; age: number; final: boolean }>(
    `select computed_at::text as stamp, extract(epoch from now() - computed_at)::float8 as age, final from day_scores where day=$1::date`,
    [day],
  );
  const load = async (): Promise<DayScores> => {
    if (hit && hit.stamp === row?.stamp) return hit.scores;
    const [d] = await db.query<{ data: Record<string, [number, string]> | string }>(`select data from day_scores where day=$1::date`, [day]);
    const o = (typeof d?.data === 'string' ? JSON.parse(d.data) : d?.data ?? {}) as Record<string, [number, string]>;
    return new Map(Object.entries(o).map(([k, v]) => [k, { score: v[0], grid: v[1] }]));
  };
  let scores: DayScores;
  let stamp = row?.stamp ?? '';
  if (row && (row.final || row.age < DB_FRESH_S)) {
    scores = await load();
  } else {
    const claimed = await db.query(
      `update day_scores set claimed_at = now() where day=$1::date and claimed_at < now() - interval '15 seconds' returning 1`,
      [day],
    );
    if (claimed.length || !row || row.age > 3600) {
      scores = await computeScores(db, day);
      const data = Object.fromEntries([...scores].map(([k, v]) => [k, [v.score, v.grid]]));
      const [u] = await db.query<{ stamp: string }>(
        `update day_scores set data=$2::jsonb, computed_at=now(), final=$3 where day=$1::date returning computed_at::text as stamp`,
        [day, JSON.stringify(data), day < vnToday()],
      );
      stamp = u?.stamp ?? '';
    } else {
      // Another instance is recomputing right now: the last result, at most a minute old, will do.
      scores = await load();
    }
  }
  dayCache.set(day, { at: Date.now(), scores, stamp });
  return scores;
}

/** The day's scores: every answer was scored for good when it landed, so this only adds up what is stored. */
export async function computeScores(db: Db, day: string, playerId?: string): Promise<DayScores> {
  const set = await dailySet(db, day);
  const turns = await db.query<{ player_id: string; question_id: string; tier: number | null; points: number | null }>(
    playerId
      ? `select player_id, question_id, tier, points from turns where day=$1::date and mode='daily' and answered_at is not null and player_id=$2`
      : `select player_id, question_id, tier, points from turns where day=$1::date and mode='daily' and answered_at is not null`,
    playerId ? [day, playerId] : [day],
  );
  const by = new Map<string, { score: number; tiers: Map<string, number> }>();
  for (const t of turns) {
    const p = by.get(t.player_id) ?? { score: 0, tiers: new Map() };
    by.set(t.player_id, p);
    const ok = t.tier != null && t.tier >= 0;
    p.score += ok ? t.points ?? 0 : 0;
    p.tiers.set(t.question_id, ok ? t.tier! : -1);
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
  const tl = await tallies(db, day, set);
  return Promise.all(
    set.map(async (id, i) => {
      const q = await dayQuestion(db, day, id);
      const c = crowdFrom(q, null, tl.get(id)!);
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

export async function finish(db: Db, a: { playerId: string; day: string; mode: Mode; name?: string; dev?: string; since?: string; runSince?: string }) {
  const name = typeof a.name === 'string' ? a.name.replace(/\s+/g, ' ').trim().slice(0, 24) || null : null;
  let grid: string;
  let score: number;
  if (a.mode === 'daily') {
    // The player's own score is always fresh; everyone else's comes from the shared half-minute recompute.
    const s = (await computeScores(db, a.day, a.playerId)).get(a.playerId);
    score = s?.score ?? 0;
    grid = s?.grid ?? 'x'.repeat(DAILY_COUNT);
  } else {
    // Only this run: a player may fly Thả vô tận several times a day, and each run starts from the meadow.
    const since = a.runSince && !Number.isNaN(Date.parse(a.runSince)) ? new Date(Date.parse(a.runSince) - 1000).toISOString() : null;
    const rows = await db.query<{ tier: number | null; points: number | null }>(
      since
        ? `select tier, points from turns where player_id=$1 and day=$2::date and mode='night' and answered_at is not null and started_at >= $3::timestamptz order by answered_at`
        : `select tier, points from turns where player_id=$1 and day=$2::date and mode='night' and answered_at is not null order by answered_at`,
      since ? [a.playerId, a.day, since] : [a.playerId, a.day],
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

/** A random active question for Thả vô tận, avoiding the ones this run has already seen. */
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
    // A new answer the village was still weighing goes too.
    await db.query(`update answers set status='rejected' where question_id=$1 and key=$2 and source='crowd' and status='pending'`, [a.questionId, a.inputKey]);
    forgetQuestion(a.questionId);
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
  // A new answer the village was still weighing is confirmed by the village head.
  await db.query(`update answers set status='approved', prior_tier=$3 where question_id=$1 and key=$2 and status='pending'`, [a.questionId, key, tier]);
  await db.query(`update submissions set status='accepted' where question_id=$1 and input_key=$2`, [a.questionId, a.inputKey]);
  await db.query(`delete from verdicts where question_id=$1 and input_key=$2`, [a.questionId, a.inputKey]);
  forgetQuestion(a.questionId);
  return { ok: true, key };
}

/* ------------------------------------------------------------------ late verdicts */

/** Where this player's new answers stand now: still waiting, confirmed (maybe under the book's name), or not counted. */
export async function newAnswerStatus(db: Db, a: { playerId: string; day: string; mode: Mode; questionIds: string[] }) {
  const ids = a.questionIds.slice(0, 10).map(String);
  const turns = await db.query<{ question_id: string; answer_key: string | null }>(
    `select question_id, answer_key from turns where player_id=$1 and day=$2::date and mode=$3 and question_id = any($4::text[])`,
    [a.playerId, a.day, a.mode, ids],
  );
  const out: { questionId: string; state: 'pending' | 'approved' | 'rejected'; display: string | null }[] = [];
  for (const t of turns) {
    if (!t.answer_key) continue;
    const q = await loadQuestion(db, t.question_id);
    const e = q.answers.get(t.answer_key);
    out.push({
      questionId: t.question_id,
      state: !e ? 'rejected' : e.status === 'pending' && e.source === 'crowd' ? 'pending' : 'approved',
      display: e?.display ?? null,
    });
  }
  return { answers: out };
}

/* ------------------------------------------------------------------ the night shift */

const NIGHT_PENDING_MAX = 300;
const NIGHT_SUBMISSIONS_MAX = 40;
const NIGHT_SUGGEST = 60;

/**
 * Runs once a night when an AI key is set:
 *  B. judges every new answer still waiting for the village (in batches per question), so none waits for votes;
 *  A. for tomorrow's seven prompts, judges what players typed before and asks for the answers the book is missing,
 *     so tomorrow most answers are found in the book at once.
 */
export async function nightShift(db: Db, ai: Ai, today = vnToday()) {
  const report = { judged: 0, approved: 0, rejected: 0, submissions: 0, added: 0, questions: [] as string[] };
  // B: the waiting new answers.
  const waiting = await db.query<{ question_id: string; key: string; display: string }>(
    `select question_id, key, display from answers where status='pending' and source='crowd' order by created_at limit $1`,
    [NIGHT_PENDING_MAX],
  );
  const byQ = new Map<string, { key: string; display: string }[]>();
  for (const w of waiting) byQ.set(w.question_id, [...(byQ.get(w.question_id) ?? []), w]);
  await Promise.all(
    [...byQ].map(async ([qid, list]) => {
      const base = BOOK_BY_ID.get(qid);
      if (!base) return;
      for (let i = 0; i < list.length; i += 25) {
        const chunk = list.slice(i, i + 25);
        const vs = await ai.judgeMany(base.prompt, base.note ?? undefined, chunk.map((x) => x.display));
        if (!vs) continue;
        for (const [k, v] of vs.entries()) {
          if (!v) continue;
          const r = await settle(db, qid, chunk[k].display, chunk[k].key, v);
          report.judged++;
          if (r === 'approved') report.approved++;
          if (r === 'rejected') report.rejected++;
        }
      }
    }),
  );
  // A: tomorrow's prompts.
  const tomorrow = new Date(new Date(today + 'T00:00:00Z').getTime() + 86400_000).toISOString().slice(0, 10);
  const ids = await dailySet(db, tomorrow);
  report.questions = ids;
  await Promise.all(
    ids.map(async (qid) => {
      const q = await loadQuestion(db, qid);
      // What players typed before that the book did not know (refused at the gates, or never confirmed).
      const subs = await db.query<{ input_key: string; display: string }>(
        `select input_key, display from submissions where question_id=$1 and status='open' order by n desc limit $2`,
        [qid, NIGHT_SUBMISSIONS_MAX],
      );
      const open = subs.filter((s) => !q.matcher.match(s.display));
      if (open.length) {
        const vs = await ai.judgeMany(q.prompt, q.note ?? undefined, open.map((s) => s.display));
        for (const [k, v] of (vs ?? []).entries()) {
          if (!v) continue;
          report.submissions++;
          if (v.valid) await learnAnswer(db, q, open[k].display, v.canonical, 'ai', 'approved', 3, v.reason);
          else await db.query(`insert into verdicts (question_id, input_key, valid, reason) values ($1,$2,false,$3) on conflict do nothing`, [qid, open[k].input_key, v.reason]);
          await db.query(`update submissions set status=$3 where question_id=$1 and input_key=$2`, [qid, open[k].input_key, v.valid ? 'accepted' : 'dismissed']);
        }
        await creditLearned(db, qid);
      }
      // The answers the book is missing.
      const known = [...q.answers.values()].map((x) => x.display);
      const more = await ai.suggest(q.prompt, q.note ?? undefined, known, NIGHT_SUGGEST);
      for (const m of more ?? []) {
        if (q.matcher.match(m.name)) continue;
        await learnAnswer(db, q, m.name, m.name, 'ai', 'approved', Math.max(1, m.tier), 'Gợi ý ban đêm');
        report.added++;
      }
      forgetQuestion(qid);
    }),
  );
  return report;
}

/* ------------------------------------------------------------------ the night shift, done by a scheduled Claude */

/** Players typing the same refused answer before the night shift looks at the referee's refusal again. */
const SECOND_LOOK = 3;

/** What the night shift needs to read: tomorrow's prompts with the book's answers, and every answer still waiting. */
export async function nightQueue(db: Db, today = vnToday()) {
  const tomorrow = new Date(new Date(today + 'T00:00:00Z').getTime() + 86400_000).toISOString().slice(0, 10);
  const ids = await dailySet(db, tomorrow);
  const questions = await Promise.all(
    ids.map(async (id) => {
      const q = await loadQuestion(db, id);
      return { id, prompt: q.prompt, note: q.note, known: [...q.answers.values()].map((a) => a.display) };
    }),
  );
  const pending = await db.query<{ q: string; prompt: string; key: string; display: string; plays: number }>(
    `select a.question_id as q, qs.prompt, a.key, a.display, coalesce(c.n,0)::int as plays
     from answers a join questions qs on qs.id=a.question_id left join counts c on c.question_id=a.question_id and c.answer_key=a.key
     where a.status='pending' and a.source='crowd' order by a.created_at limit 300`,
  );
  const submissions = await db.query<{ q: string; prompt: string; key: string; display: string; n: number }>(
    `select s.question_id as q, qs.prompt, s.input_key as key, s.display, s.n from submissions s join questions qs on qs.id=s.question_id
     where (s.status='open' and not exists (select 1 from verdicts v where v.question_id=s.question_id and v.input_key=s.input_key))
        or (s.status='ai-no' and s.n >= $2)
     order by (s.question_id = any($1::text[])) desc, s.n desc limit 200`,
    [ids, SECOND_LOOK],
  );
  return { today, tomorrow, questions, pending, submissions };
}

/** Applies the night shift's verdicts once per batch (by its day); safe to call again. */
export async function applyNight(db: Db, batch: { day: string; pending: NightVerdict[]; submissions: NightVerdict[] }) {
  if (!batch.day) return { applied: false, reason: 'empty' };
  const [done] = await db.query<{ value: string }>(`select value from meta where key='night_applied'`);
  if (done?.value === batch.day) return { applied: false, reason: 'already', day: batch.day };
  const out = { applied: true, day: batch.day, approved: 0, rejected: 0, learned: 0, refused: 0, credited: 0 };
  for (const v of batch.pending) {
    if (!BOOK_BY_ID.has(v.q)) continue;
    const [row] = await db.query<{ display: string }>(`select display from answers where question_id=$1 and key=$2`, [v.q, v.key]);
    if (!row) continue;
    const r = await settle(db, v.q, row.display, v.key, { valid: v.valid, canonical: v.canonical, reason: v.reason });
    if (r === 'approved') out.approved++;
    if (r === 'rejected') out.rejected++;
  }
  for (const v of batch.submissions) {
    if (!BOOK_BY_ID.has(v.q)) continue;
    const [row] = await db.query<{ display: string }>(`select display from submissions where question_id=$1 and input_key=$2`, [v.q, v.key]);
    if (!row) continue;
    if (v.valid && v.canonical.trim()) {
      const q = await loadQuestion(db, v.q);
      await learnAnswer(db, q, row.display, v.canonical.trim().slice(0, 60), 'ai', 'approved', 3, v.reason || 'Ca đêm công nhận');
      out.learned++;
    } else {
      await db.query(
        `insert into verdicts (question_id, input_key, valid, reason) values ($1,$2,false,$3) on conflict (question_id, input_key) do nothing`,
        [v.q, v.key, v.reason || 'Trọng tài không công nhận đáp án này.'],
      );
      out.refused++;
    }
    await db.query(`update submissions set status=$3 where question_id=$1 and input_key=$2`, [v.q, v.key, v.valid ? 'accepted' : 'dismissed']);
    forgetQuestion(v.q);
  }
  // Players who typed what was just approved get its points on that day's flight.
  for (const qid of new Set(batch.submissions.filter((v) => v.valid).map((v) => v.q))) out.credited += await creditLearned(db, qid);
  await db.query(`insert into meta (key, value) values ('night_applied', $1) on conflict (key) do update set value=excluded.value`, [batch.day]);
  return out;
}
