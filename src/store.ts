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
  }
  return id;
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
};

export interface LocalRow {
  questionId: string;
  prompt: string;
  display: string | null;
  tier: number;
  points: number;
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
}

export function stats(): Stats {
  return read<Stats>('stats', { best: 0, nightBest: 0, streak: 0, lastDay: null, flights: 0 });
}

export function recordFlight(day: string, mode: 'daily' | 'night', altitude: number) {
  const s = stats();
  if (mode === 'night') {
    s.nightBest = Math.max(s.nightBest, altitude);
  } else if (s.lastDay !== day) {
    const y = new Date(day + 'T00:00:00Z');
    y.setUTCDate(y.getUTCDate() - 1);
    s.streak = s.lastDay === y.toISOString().slice(0, 10) ? s.streak + 1 : 1;
    s.lastDay = day;
    s.flights++;
    s.best = Math.max(s.best, altitude);
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
