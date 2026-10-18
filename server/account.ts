// Accounts: an optional Google sign-in (Neon Auth) that keeps one history across devices.
//
// Where the data lives: in the game's own Postgres (Neon), next to turns and runs, so an account is just a row that
// names the player id every signed-in device plays as. Neon Auth (in the same Neon project) only proves who signed
// in: right after Google sends the player back, the browser holds a short-lived token from Neon Auth, the server
// checks it against Neon Auth's public keys, and hands out Bilion's own session. From then on nothing depends on the
// auth server's cookies, which iPhones block across sites.
import { createHash, randomBytes } from 'node:crypto';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import type { Db } from './db.js';
import { GameError, checkPlayer, dayQuestion, vnToday } from './service.js';

export interface Identity {
  sub: string;
  email?: string;
  name?: string;
}

type Verifier = (jwt: string) => Promise<Identity>;

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

/** Checks a Neon Auth token (EdDSA, issued by the auth server's origin) and reads who it names. */
async function neonVerify(jwt: string): Promise<Identity> {
  const base = (process.env.NEON_AUTH_BASE_URL ?? '').replace(/\/$/, '');
  if (!base) throw new GameError(503, 'Đăng nhập chưa được bật.');
  jwks ??= createRemoteJWKSet(new URL(`${base}/.well-known/jwks.json`));
  try {
    const { payload } = await jwtVerify(jwt, jwks, { issuer: new URL(base).origin });
    if (typeof payload.sub !== 'string' || !payload.sub) throw new Error('no subject');
    return {
      sub: payload.sub,
      email: typeof payload.email === 'string' ? payload.email : undefined,
      name: typeof payload.name === 'string' ? payload.name : undefined,
    };
  } catch {
    throw new GameError(401, 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn. Thử đăng nhập lại nhé.');
  }
}

let verify: Verifier = neonVerify;

/** Tests swap the token check for their own. */
export function setVerifier(v: Verifier | null) {
  verify = v ?? neonVerify;
}

/** A session unused this long is gone; signing in again starts a new one. */
const SESSION_DAYS = 180;

const hash = (t: string) => createHash('sha256').update(t).digest('hex');
const newPlayerId = () => randomBytes(16).toString('hex');

export interface Account {
  user_id: string;
  email: string | null;
  name: string | null;
  player_id: string;
}

async function newSession(db: Db, userId: string) {
  const token = randomBytes(32).toString('base64url');
  await db.query(`insert into sessions (token_hash, user_id) values ($1,$2)`, [hash(token), userId]);
  return token;
}

/** The account behind an `Authorization: Bearer <session>` header. */
export async function sessionAccount(db: Db, auth: string): Promise<Account> {
  const m = /^Bearer ([A-Za-z0-9_-]{20,100})$/.exec(auth.trim());
  if (!m) throw new GameError(401, 'Bạn chưa đăng nhập.');
  const [row] = await db.query<Account & { stale: boolean }>(
    `select a.user_id, a.email, a.name, a.player_id, s.last_at < now() - interval '1 day' as stale
     from sessions s join accounts a on a.user_id = s.user_id
     where s.token_hash = $1 and s.last_at > now() - make_interval(days => $2)`,
    [hash(m[1]), SESSION_DAYS],
  );
  if (!row) throw new GameError(401, 'Phiên đăng nhập đã hết hạn. Đăng nhập lại nhé.');
  if (row.stale) await db.query(`update sessions set last_at = now() where token_hash = $1`, [hash(m[1])]);
  return { user_id: row.user_id, email: row.email, name: row.name, player_id: row.player_id };
}

/** Days this player id flew (daily or Thả vô tận). */
async function daysFlown(db: Db, playerId: string) {
  const [r] = await db.query<{ n: number }>(`select count(distinct (day, mode))::int as n from turns where player_id = $1 and answered_at is not null`, [playerId]);
  return r?.n ?? 0;
}

/**
 * Signs in with a Neon Auth token. A first sign-in makes the account and keeps this device's history as its own; a
 * later sign-in on another device switches that device to the account's player id and says whether the device has a
 * history of its own to fold in (the player decides, see merge).
 */
export async function login(db: Db, a: { jwt: string; playerId: unknown }) {
  if (typeof a.jwt !== 'string' || a.jwt.length < 20 || a.jwt.length > 4000) throw new GameError(400, 'Thiếu mã đăng nhập.');
  const id = await verify(a.jwt);
  const device = checkPlayer(a.playerId);
  let [acc] = await db.query<Account>(`select user_id, email, name, player_id from accounts where user_id = $1`, [id.sub]);
  let created = false;
  if (!acc) {
    // A device id already tied to another account (two people sharing a phone) is not handed to a second one.
    const [taken] = await db.query(`select 1 from accounts where player_id = $1`, [device]);
    [acc] = await db.query<Account>(
      `insert into accounts (user_id, email, name, player_id) values ($1,$2,$3,$4)
       on conflict (user_id) do update set last_at = now() returning user_id, email, name, player_id`,
      [id.sub, id.email ?? null, id.name ?? null, taken ? newPlayerId() : device],
    );
    created = acc.player_id === device;
  } else {
    await db.query(`update accounts set email = coalesce($2, email), name = coalesce($3, name), last_at = now() where user_id = $1`, [id.sub, id.email ?? null, id.name ?? null]);
  }
  const session = await newSession(db, acc.user_id);
  let deviceDays = 0;
  if (device !== acc.player_id) {
    const [other] = await db.query(`select 1 from accounts where player_id = $1`, [device]);
    const [done] = await db.query(`select 1 from account_merges where user_id = $1 and from_player = $2`, [acc.user_id, device]);
    if (!other && !done) deviceDays = await daysFlown(db, device);
  }
  return {
    session,
    playerId: acc.player_id,
    created,
    deviceDays,
    profile: { name: id.name ?? acc.name, email: id.email ?? acc.email },
  };
}

/**
 * Folds a device's earlier history into the signed-in account. A day the account already flew (in that mode) keeps
 * the account's answers whole: two half flights are never stitched into one.
 */
export async function merge(db: Db, auth: string, fromRaw: unknown) {
  const acc = await sessionAccount(db, auth);
  const from = checkPlayer(fromRaw);
  if (from === acc.player_id) return { days: 0 };
  const [other] = await db.query(`select 1 from accounts where player_id = $1`, [from]);
  if (other) throw new GameError(403, 'Lịch sử này thuộc một tài khoản khác.');
  const free = await db.query<{ day: string; mode: string }>(
    `select distinct to_char(t.day, 'YYYY-MM-DD') as day, t.mode from turns t
     where t.player_id = $1 and not exists (select 1 from turns a where a.player_id = $2 and a.day = t.day and a.mode = t.mode)`,
    [from, acc.player_id],
  );
  if (free.length) {
    const days = free.map((f) => f.day);
    const modes = free.map((f) => f.mode);
    const pick = `(day, mode) in (select d::date, m from unnest($3::text[], $4::text[]) as x(d, m))`;
    await db.query(`update turns set player_id = $2 where player_id = $1 and ${pick}`, [from, acc.player_id, days, modes]);
    await db.query(
      `update runs set player_id = $2 where player_id = $1 and ${pick}
         and not exists (select 1 from runs r where r.player_id = $2 and r.day = runs.day and r.mode = runs.mode)`,
      [from, acc.player_id, days, modes],
    );
    // The day's score cache is rebuilt from the turns for the days that moved.
    await db.query(`update day_scores set final = false, computed_at = 'epoch' where day = any($1::date[])`, [days]);
  }
  await db.query(
    `update asks set player_id = $2 where player_id = $1
       and not exists (select 1 from asks x where x.player_id = $2 and x.question_id = asks.question_id and x.input_key = asks.input_key)`,
    [from, acc.player_id],
  );
  // Friends made on this device race the account from now on.
  await db.query(
    `insert into friendships (player_id, friend) select $2, friend from friendships where player_id = $1 and friend <> $2 on conflict do nothing`,
    [from, acc.player_id],
  );
  await db.query(
    `insert into friendships (player_id, friend) select player_id, $2 from friendships where friend = $1 and player_id <> $2 on conflict do nothing`,
    [from, acc.player_id],
  );
  await db.query(`delete from friendships where player_id = $1 or friend = $1`, [from]);
  // A name the village head took off the board stays off on the account too.
  await db.query(`insert into muted (player_id) select $2 where exists (select 1 from muted where player_id = $1) on conflict do nothing`, [from, acc.player_id]);
  await db.query(
    `insert into account_merges (user_id, from_player, days) values ($1,$2,$3) on conflict (user_id, from_player) do update set days = account_merges.days + excluded.days, at = now()`,
    [acc.user_id, from, free.length],
  );
  return { days: free.length };
}

export async function logout(db: Db, auth: string) {
  const m = /^Bearer (.+)$/.exec(auth.trim());
  if (m) await db.query(`delete from sessions where token_hash = $1`, [hash(m[1])]);
  return { ok: true };
}

/** The same shape the game keeps on each device (src/store.ts Stats), rebuilt from the account's runs. */
export interface ServerStats {
  best: number;
  nightBest: number;
  streak: number;
  lastDay: string | null;
  flights: number;
  bestStreak: number;
  total: number;
  bestScore: number;
  tiers: number[];
  misses: number;
}

const prevDay = (d: string) => {
  const t = new Date(d + 'T00:00:00Z');
  t.setUTCDate(t.getUTCDate() - 1);
  return t.toISOString().slice(0, 10);
};

export async function accountStats(db: Db, playerId: string): Promise<ServerStats> {
  const runs = await db.query<{ day: string; score: number; altitude: number; grid: string }>(
    `select to_char(day, 'YYYY-MM-DD') as day, score, altitude, grid from runs where player_id = $1 and mode = 'daily' order by day`,
    [playerId],
  );
  const [night] = await db.query<{ best: number | null }>(`select max(altitude) as best from runs where player_id = $1 and mode = 'night'`, [playerId]);
  const s: ServerStats = { best: 0, nightBest: Number(night?.best ?? 0), streak: 0, lastDay: null, flights: 0, bestStreak: 0, total: 0, bestScore: 0, tiers: [0, 0, 0, 0, 0, 0, 0], misses: 0 };
  for (const r of runs) {
    s.streak = s.lastDay && s.lastDay === prevDay(r.day) ? s.streak + 1 : 1;
    s.bestStreak = Math.max(s.bestStreak, s.streak);
    s.lastDay = r.day;
    s.flights++;
    s.best = Math.max(s.best, Number(r.altitude));
    s.total += r.score;
    s.bestScore = Math.max(s.bestScore, r.score);
    for (const c of r.grid) {
      if (c === 'x') s.misses++;
      else if (s.tiers[Number(c)] !== undefined) s.tiers[Number(c)]++;
    }
  }
  return s;
}

/** Hidden answers of the account's finished days (the last 30), for the collection on a new device. */
async function accountAlbum(db: Db, playerId: string) {
  const rows = await db.query<{ day: string; question_id: string; prompt: string; tier: number | null }>(
    `select to_char(t.day, 'YYYY-MM-DD') as day, t.question_id, q.prompt, t.tier
     from turns t join questions q on q.id = t.question_id
     where t.player_id = $1 and t.mode = 'daily' and t.day < $2::date and t.day >= $2::date - 30
     order by t.day desc`,
    [playerId, vnToday()],
  );
  const out: { day: string; questionId: string; prompt: string; krill: string; found: boolean }[] = [];
  for (const r of rows) {
    const q = await dayQuestion(db, r.day, r.question_id).catch(() => null);
    const krill = q?.answers.get(q.krillKey)?.display;
    if (krill) out.push({ day: r.day, questionId: r.question_id, prompt: r.prompt, krill, found: r.tier === 5 });
  }
  return out;
}

export async function me(db: Db, auth: string) {
  const acc = await sessionAccount(db, auth);
  const [first] = await db.query<{ day: string | null }>(`select to_char(min(day), 'YYYY-MM-DD') as day from turns where player_id = $1`, [acc.player_id]);
  return {
    playerId: acc.player_id,
    profile: { name: acc.name, email: acc.email },
    since: first?.day ?? vnToday(),
    stats: await accountStats(db, acc.player_id),
    album: await accountAlbum(db, acc.player_id),
  };
}
