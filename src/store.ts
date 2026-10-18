// Per-device memory: who this player is, their name, sound choice, streak and today's flight.
import type { FinishResult } from './api';

const K = 'thadieu.v1.';

function read<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(K + key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(K + key, JSON.stringify(value));
  } catch {
    /* storage unavailable: the game still works for this visit */
  }
}

export function playerId(): string {
  let id = read<string>('player', '');
  if (!id) {
    id = (crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`).replace(/[^A-Za-z0-9]/g, '').slice(0, 32);
    write('player', id);
    write('since', vnDay());
  }
  return id;
}

/** The day this device first played, so the server can tell a private-tab replay from a long-time player. */
export function playerSince(): string {
  playerId();
  return read<string>('since', '2020-01-01');
}

export const prefs = {
  get sound() {
    return read('sound', true);
  },
  set sound(v: boolean) {
    write('sound', v);
  },
  get name() {
    return read('name', '');
  },
  set name(v: string) {
    write('name', v);
  },
  /** The first-flight tips have been shown. */
  get coached() {
    return read('coached', false);
  },
  set coached(v: boolean) {
    write('coached', v);
  },
  /** The day whose hidden answers the home screen last showed. */
  get ydaySeen() {
    return read('ydaySeen', '');
  },
  set ydaySeen(v: string) {
    write('ydaySeen', v);
  },
  get skin() {
    return read('skin', 'son');
  },
  set skin(v: string) {
    write('skin', v);
  },
};

/* ---------------------------------------------------------------- collection */

export interface AlbumEntry {
  day: string;
  prompt: string;
  krill: string;
  found: boolean;
}

/** Every hidden Độc nhất answer seen at the end of a daily flight, keyed by day and question. */
export function album(): Record<string, AlbumEntry> {
  return read<Record<string, AlbumEntry>>('album', {});
}

/** Adds a day's answers to the collection; a hidden answer still locked (null, before midnight) waits for later. */
export function addToAlbum(day: string, items: { questionId: string; prompt: string; krill: string | null; tier: number }[]) {
  const a = album();
  for (const it of items) {
    if (!it.krill) continue;
    const k = `${day}:${it.questionId}`;
    a[k] = { day, prompt: it.prompt, krill: it.krill, found: it.tier === 5 || !!a[k]?.found };
  }
  write('album', a);
}

export function krillFound(): number {
  return Object.values(album()).filter((e) => e.found).length;
}

export interface LocalRow {
  questionId: string;
  prompt: string;
  display: string | null;
  tier: number;
  points: number;
  /** A new answer still waiting for the village to confirm it. */
  pending?: boolean;
  /** What the player typed when the kite did not lift. */
  input?: string;
}

export interface DayRecord {
  day: string;
  rows: LocalRow[];
  result?: FinishResult;
}

export function today(): DayRecord | null {
  return read<DayRecord | null>('today', null);
}

export function saveToday(r: DayRecord) {
  write('today', r);
}

export interface Stats {
  best: number;
  nightBest: number;
  streak: number;
  lastDay: string | null;
  flights: number;
  /** Longest run of days in a row. */
  bestStreak: number;
  /** Sum of daily scores, for the average. */
  total: number;
  /** Best daily score. */
  bestScore: number;
  /** How many answers landed in each tier (index = tier), and how many prompts ran out of wind. */
  tiers: number[];
  misses: number;
}

const EMPTY: Stats = { best: 0, nightBest: 0, streak: 0, lastDay: null, flights: 0, bestStreak: 0, total: 0, bestScore: 0, tiers: [0, 0, 0, 0, 0, 0, 0], misses: 0 };

export function stats(): Stats {
  const s = { ...EMPTY, ...read<Partial<Stats>>('stats', {}) };
  s.bestStreak = Math.max(s.bestStreak, s.streak);
  if (!Array.isArray(s.tiers) || s.tiers.length < 7) s.tiers = [0, 0, 0, 0, 0, 0, 0];
  return s;
}

export function recordFlight(day: string, mode: 'daily' | 'night', altitude: number, score = 0, grid = '') {
  const s = stats();
  if (mode === 'night') {
    s.nightBest = Math.max(s.nightBest, altitude);
  } else if (s.lastDay !== day) {
    const y = new Date(day + 'T00:00:00Z');
    y.setUTCDate(y.getUTCDate() - 1);
    s.streak = s.lastDay === y.toISOString().slice(0, 10) ? s.streak + 1 : 1;
    s.bestStreak = Math.max(s.bestStreak, s.streak);
    s.lastDay = day;
    s.flights++;
    s.best = Math.max(s.best, altitude);
    s.total += score;
    s.bestScore = Math.max(s.bestScore, score);
    for (const c of grid) {
      if (c === 'x') s.misses++;
      else if (s.tiers[Number(c)] !== undefined) s.tiers[Number(c)]++;
    }
  } else {
    s.best = Math.max(s.best, altitude);
  }
  write('stats', s);
  return s;
}

/** Vietnam calendar day, matching the server. */
export function vnDay(now = new Date()) {
  return new Date(now.getTime() + 7 * 3600_000).toISOString().slice(0, 10);
}

/** Milliseconds until midnight in Vietnam, when the next daily flight opens. */
export function msToNextDay(now = new Date()) {
  const vn = new Date(now.getTime() + 7 * 3600_000);
  const next = Date.UTC(vn.getUTCFullYear(), vn.getUTCMonth(), vn.getUTCDate() + 1) - 7 * 3600_000;
  return next - now.getTime();
}

/* ---------------------------------------------------------------- account */

export interface AccountInfo {
  session: string;
  name: string | null;
  email: string | null;
}

/** The signed-in account on this device, if any. */
export function account(): AccountInfo | null {
  return read<AccountInfo | null>('account', null);
}

interface DeviceBackup {
  player: string;
  since: string;
  stats: Partial<Stats>;
  album: Record<string, AlbumEntry>;
  today: DayRecord | null;
}

/**
 * Switches this device to the account: its player id from now on, and the account's numbers and collection. The
 * device's own state is kept aside, so signing out gives the device back what it had.
 */
export function enterAccount(
  info: AccountInfo,
  me: { playerId: string; since: string; stats: Partial<Stats>; album: { day: string; questionId: string; prompt: string; krill: string; found: boolean }[] },
  opts: { keepDevice: boolean },
) {
  const device = playerId();
  if (!read<DeviceBackup | null>('deviceBackup', null) && device !== me.playerId) {
    write('deviceBackup', { player: device, since: playerSince(), stats: read('stats', {}), album: album(), today: today() } satisfies DeviceBackup);
  }
  write('account', info);
  write('player', me.playerId);
  write('since', me.since);
  write('stats', me.stats);
  const a: Record<string, AlbumEntry> = opts.keepDevice ? album() : {};
  for (const e of me.album) {
    const k = `${e.day}:${e.questionId}`;
    a[k] = { day: e.day, prompt: e.prompt, krill: e.krill, found: e.found || !!a[k]?.found };
  }
  write('album', a);
  // Today's flight on this device belongs to the account only when the device's history was folded in.
  const t = today();
  if (t && device !== me.playerId && !opts.keepDevice) write('today', null);
}

/** Refreshes the account's numbers on this device (another device may have flown since). */
export function refreshAccount(me: { stats: Partial<Stats>; album: { day: string; questionId: string; prompt: string; krill: string; found: boolean }[] }) {
  write('stats', me.stats);
  const a = album();
  for (const e of me.album) {
    const k = `${e.day}:${e.questionId}`;
    a[k] = { day: e.day, prompt: e.prompt, krill: e.krill, found: e.found || !!a[k]?.found };
  }
  write('album', a);
}

/** Signs this device out: back to the player it was before, or a fresh one. */
export function leaveAccount() {
  const b = read<DeviceBackup | null>('deviceBackup', null);
  write('account', null);
  write('deviceBackup', null);
  if (b) {
    write('player', b.player);
    write('since', b.since);
    write('stats', b.stats);
    write('album', b.album);
    write('today', b.today);
  } else {
    write('player', '');
    write('stats', {});
    write('album', {});
    write('today', null);
    playerId();
  }
}
