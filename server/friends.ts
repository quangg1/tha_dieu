// Friends: a small board of people who invited each other, racing day by day.
//
// A player id is a secret (it is what proves who plays), so friends never see each other's: each player gets a
// short public invite code, and the board names people by that code and the name they chose.
import { randomBytes } from 'node:crypto';
import type { Db } from './db.js';
import { boardName } from '../shared/names.js';
import { GameError, vnToday } from './service.js';

/** Friends one player can have on the board. */
const MAX_FRIENDS = 50;
/** Days in the race over time. */
const WEEK = 7;

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const newCode = () => [...randomBytes(8)].map((b) => ALPHABET[b % ALPHABET.length]).join('');
const cleanCode = (c: unknown) => (typeof c === 'string' && /^[A-Z2-9]{8}$/.test(c.toUpperCase()) ? c.toUpperCase() : null);

/** This player's invite code (made on first ask); a name given here becomes the one friends see. */
export async function myCode(db: Db, playerId: string, name?: unknown) {
  const n = boardName(name);
  const [row] = await db.query<{ code: string; name: string | null }>(`select code, name from friend_codes where player_id = $1`, [playerId]);
  if (row) {
    if (n && n !== row.name) await db.query(`update friend_codes set name = $2 where player_id = $1`, [playerId, n]);
    return { code: row.code, name: n ?? row.name };
  }
  for (let i = 0; i < 5; i++) {
    const code = newCode();
    const r = await db.query<{ code: string }>(
      `insert into friend_codes (player_id, code, name) values ($1,$2,$3) on conflict do nothing returning code`,
      [playerId, code, n],
    );
    if (r.length) return { code, name: n };
    const [again] = await db.query<{ code: string; name: string | null }>(`select code, name from friend_codes where player_id = $1`, [playerId]);
    if (again) return { code: again.code, name: again.name };
  }
  throw new GameError(500, 'Chưa tạo được mã mời, thử lại nhé.');
}

/** Who an invite code belongs to (name only), for the invitation card. */
export async function whoIs(db: Db, codeRaw: unknown) {
  const code = cleanCode(codeRaw);
  if (!code) throw new GameError(400, 'Mã mời không hợp lệ.');
  const [row] = await db.query<{ name: string | null }>(`select name from friend_codes where code = $1`, [code]);
  if (!row) throw new GameError(404, 'Không tìm thấy lời mời này.');
  return { name: row.name ?? 'Một người thả diều' };
}

/** Accepts an invitation: both players appear on each other's board. */
export async function join(db: Db, playerId: string, codeRaw: unknown, name?: unknown) {
  const code = cleanCode(codeRaw);
  if (!code) throw new GameError(400, 'Mã mời không hợp lệ.');
  const [owner] = await db.query<{ player_id: string; name: string | null }>(`select player_id, name from friend_codes where code = $1`, [code]);
  if (!owner) throw new GameError(404, 'Không tìm thấy lời mời này.');
  if (owner.player_id === playerId) throw new GameError(400, 'Đây là lời mời của chính bạn. Gửi nó cho bạn bè nhé!');
  await myCode(db, playerId, name);
  for (const p of [playerId, owner.player_id]) {
    const [c] = await db.query<{ n: number }>(`select count(*)::int as n from friendships where player_id = $1`, [p]);
    if (c.n >= MAX_FRIENDS) throw new GameError(400, `Bảng bạn bè đã đủ ${MAX_FRIENDS} người.`);
  }
  await db.query(
    `insert into friendships (player_id, friend) values ($1,$2), ($2,$1) on conflict do nothing`,
    [playerId, owner.player_id],
  );
  return { name: owner.name ?? 'Một người thả diều' };
}

/** Takes a friend off the board (both ways). */
export async function leave(db: Db, playerId: string, codeRaw: unknown) {
  const code = cleanCode(codeRaw);
  if (!code) throw new GameError(400, 'Mã không hợp lệ.');
  const [f] = await db.query<{ player_id: string }>(`select player_id from friend_codes where code = $1`, [code]);
  if (f) await db.query(`delete from friendships where (player_id = $1 and friend = $2) or (player_id = $2 and friend = $1)`, [playerId, f.player_id]);
  return { ok: true };
}

export interface FriendRow {
  code: string;
  name: string;
  me: boolean;
  /** Today: finished today's flight. */
  flew: boolean;
  /** Today's score and height, shown only once the asking player has finished their own flight. */
  score: number | null;
  altitude: number | null;
  grid: string | null;
  /** The last seven days (today included): total score and days flown. */
  week: number;
  days: number;
}

/**
 * The friends board. Today's numbers stay hidden until the asking player has finished their own flight, so a
 * friend's score never tells them what to aim for; the week's totals leave today out until then for the same reason.
 */
export async function friendsBoard(db: Db, playerId: string) {
  const today = vnToday();
  const from = vnToday(new Date(Date.now() - (WEEK - 1) * 86_400_000));
  const mine = await myCode(db, playerId);
  const people = await db.query<{ player_id: string; code: string; name: string | null }>(
    `select c.player_id, c.code, c.name from friend_codes c
     where c.player_id = $1 or c.player_id in (select friend from friendships where player_id = $1)`,
    [playerId],
  );
  const ids = people.map((p) => p.player_id);
  const runs = await db.query<{ player_id: string; day: string; score: number; altitude: number; grid: string }>(
    `select player_id, to_char(day, 'YYYY-MM-DD') as day, score, altitude, grid from runs
     where mode = 'daily' and day >= $2::date and day <= $3::date and player_id = any($1::text[])`,
    [ids, from, today],
  );
  const done = runs.some((r) => r.player_id === playerId && r.day === today);
  const rows: FriendRow[] = people.map((p) => {
    const mineRuns = runs.filter((r) => r.player_id === p.player_id && (done || r.day !== today));
    const t = runs.find((r) => r.player_id === p.player_id && r.day === today);
    return {
      code: p.code,
      name: p.name ?? (p.player_id === playerId ? 'Bạn' : 'Người thả diều'),
      me: p.player_id === playerId,
      flew: !!t,
      score: t && done ? t.score : null,
      altitude: t && done ? Number(t.altitude) : null,
      grid: t && done ? t.grid : null,
      week: mineRuns.reduce((s, r) => s + r.score, 0),
      days: mineRuns.length,
    };
  });
  return { day: today, code: mine.code, name: mine.name, done, friends: rows.length - 1, rows };
}
