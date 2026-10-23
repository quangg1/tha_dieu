import type { TierIndex } from '../shared/scoring.js';

export interface PublicQuestion {
  id: string;
  category: string;
  prompt: string;
  note: string | null;
  /** 1 easy · 2 medium · 3 hard. */
  level?: number;
}

export interface Crowd {
  total: number;
  /** pct is null while the list is the book's guess rather than real counts. */
  top: { display: string; pct: number | null; mine: boolean }[];
  mine: number | null;
  estimated: boolean;
}

export interface Reveal {
  questionId: string;
  prompt: string;
  /** The hidden answer: null until midnight, unless this player found it. */
  krill: string | null;
  top: string;
  mine: string | null;
  tier: number;
  /** Every answer by tier, for a player who flew the whole day. */
  list?: { tier: number; names: string[] }[];
}

export interface AnswerResult {
  status: 'landed' | 'retry' | 'checking' | 'nothing' | 'late' | 'confirm' | 'vague' | 'empty';
  input?: string;
  suggestion?: string;
  reason?: string;
  display?: string;
  tier?: TierIndex;
  points?: number;
  bonus?: number;
  /** Nối gió: the multiplier this answer was scored with. */
  gio?: number;
  judged?: boolean;
  share?: number | null;
  crowd?: Crowd;
}

export interface FinishResult {
  score: number;
  altitude: number;
  grid: string;
  rank: number;
  players: number;
  beaten: number;
  /** A second run from this device today: it stays off the board. */
  replay?: boolean;
  /** The day is over and the scores are final. */
  settled?: boolean;
  /** The name typed was kept off the board (rude, or muted by the village head). */
  nameRefused?: boolean;
  reveal?: Reveal[];
  /** The day's scores in buckets of w points, for the curve. */
  dist?: { w: number; counts: number[] };
}

export interface NightBoardRow {
  rank: number;
  name: string;
  score: number;
  altitude: number;
  /** The day the run was flown. */
  day: string;
  me: boolean;
}

export interface NightBoard {
  period: 'day' | 'week' | 'all';
  players: number;
  rows: NightBoardRow[];
  /** The player's own best run when it is below the top twenty. */
  me: NightBoardRow | null;
}

export interface BoardRow {
  rank: number;
  name: string;
  altitude: number;
  score: number;
  me: boolean;
}

export interface Support {
  momo: string;
  qr: string;
  card: string;
  note: string;
  /** Bank transfer: NAPAS BIN, account number and holder name. */
  bank: string;
  account: string;
  holder: string;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function call<T>(path: string, body?: unknown, headers: Record<string, string> = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`/api/${path}`, {
      method: body === undefined ? 'GET' : 'POST',
      headers: { 'content-type': 'application/json', ...headers },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, 'Mất kết nối mạng. Kiểm tra mạng rồi thử lại.');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, data.error || `Máy chủ gặp lỗi (mã ${res.status}).`);
  return data as T;
}

export interface AccountStats {
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

export interface AccountMe {
  playerId: string;
  profile: { name: string | null; email: string | null };
  since: string;
  stats: AccountStats;
  album: { day: string; questionId: string; prompt: string; krill: string; found: boolean }[];
}

const bearer = (session: string) => ({ authorization: `Bearer ${session}` });

export interface FriendRow {
  code: string;
  name: string;
  me: boolean;
  flew: boolean;
  score: number | null;
  altitude: number | null;
  grid: string | null;
  week: number;
  days: number;
}

export interface FriendsBoard {
  day: string;
  code: string;
  name: string | null;
  done: boolean;
  friends: number;
  rows: FriendRow[];
}

export const api = {
  friends: (playerId: string, name?: string) =>
    call<FriendsBoard>(`friends?playerId=${encodeURIComponent(playerId)}${name ? `&name=${encodeURIComponent(name)}` : ''}`),
  friendWho: (code: string) => call<{ name: string }>(`friendwho?code=${encodeURIComponent(code)}`),
  friendJoin: (b: { playerId: string; code: string; name?: string }) => call<{ name: string }>('friendjoin', b),
  friendLeave: (b: { playerId: string; code: string }) => call<{ ok: boolean }>('friendleave', b),
  account: {
    login: (b: { jwt: string; playerId: string }) =>
      call<{ session: string; playerId: string; created: boolean; deviceDays: number; profile: { name: string | null; email: string | null } }>('account/login', b),
    merge: (session: string, from: string) => call<{ days: number }>('account/merge', { from }, bearer(session)),
    me: (session: string) => call<AccountMe>('account/me', undefined, bearer(session)),
    logout: (session: string) => call<{ ok: boolean }>('account/logout', {}, bearer(session)),
  },
  daily: () => call<{ day: string; questions: PublicQuestion[] }>('daily'),
  night: (seen: string[]) => call<{ day: string; question: PublicQuestion }>('night', { seen }),
  start: (b: { playerId: string; day: string; mode: string; questionId: string }) =>
    call<{ startedAt: string; now: string; answered: boolean }>('start', b),
  answer: (b: { playerId: string; day: string; mode: string; questionId: string; input: string }) => call<AnswerResult>('answer', b),
  newstatus: (b: { playerId: string; day: string; mode: string; questionIds: string[] }) =>
    call<{ answers: { questionId: string; state: 'pending' | 'approved' | 'rejected'; display: string | null }[] }>('newstatus', b),
  notices: (playerId: string) => call<{ learned: { questionId: string; prompt: string; typed: string; answer: string; points?: number }[] }>('notices', { playerId }),
  miss: (b: { playerId: string; day: string; mode: string; questionId: string }) => call<{ ok: boolean }>('miss', b),
  finish: (b: { playerId: string; day: string; mode: string; name?: string; since?: string; runSince?: string }) => call<FinishResult>('finish', b),
  board: (mode: string, playerId: string) => call<{ players: number; settled?: boolean; rows: BoardRow[] }>(`board?mode=${mode}&playerId=${encodeURIComponent(playerId)}`),
  nightBoard: (period: 'day' | 'week' | 'all', playerId: string) => call<NightBoard>(`board/night?period=${period}&playerId=${encodeURIComponent(playerId)}`),
  yesterday: (playerId: string) => call<{ day: string; reveal: Reveal[] }>(`yesterday?playerId=${encodeURIComponent(playerId)}`),
  report: (b: { questionId: string; input: string; kind: 'rejected' | 'accepted'; note?: string }) => call<{ ok: boolean }>('report', b),
  gate: (s: string) => call<{ ok: boolean }>(`gate?s=${encodeURIComponent(s)}`),
  feedback: (b: { kind: string; message: string; contact?: string; playerId?: string }) => call<{ ok: boolean }>('feedback', b),
  support: () => call<Support>('support'),
  admin: {
    feedback: (token: string) =>
      call<{ feedback: { id: number; at: string; kind: string; message: string; contact: string | null; status: string }[]; support: Support }>('admin/feedback', undefined, { 'x-admin-token': token }),
    closeFeedback: (token: string, id: number) => call<{ ok: boolean }>('admin/feedback-close', { id }, { 'x-admin-token': token }),
    setSupport: (token: string, b: Support) => call<Support>('admin/support', b, { 'x-admin-token': token }),
    insights: (token: string) =>
      call<{
        today: string;
        days: { day: string; opens: number; starts: number; finishes: number; sharers: number; invited: number; fresh: number }[];
        scores: { day: string; players: number; avg: number; best: number }[];
        retention: { day: string; cohort: number; d1: number; d7: number }[];
        questions: { id: string; prompt: string; answered: number; misses: number; krill: number; clever: number; avg: number; retries: number }[];
        totals: { players: number; runs: number; answers: number };
        funnel: { day: string; name: string; players: number; n: number }[];
        errors: { message: string; n: number; last: string }[];
        reports: { question_id: string; prompt: string; input_key: string; display: string; kind: string; n: number; note: string | null }[];
      }>('admin/insights', undefined, { 'x-admin-token': token }),
    closeReport: (token: string, b: { questionId: string; inputKey: string; kind: string }) => call<{ ok: boolean }>('admin/report', b, { 'x-admin-token': token }),
    pending: (token: string) => call<{ stats: Record<string, number>; pending: { question_id: string; prompt: string; key: string; display: string; plays: number }[] }>('admin/pending', undefined, { 'x-admin-token': token }),
    review: (token: string, b: { questionId: string; key: string; decision: 'approve' | 'reject'; tier?: number }) =>
      call<{ ok: boolean }>('admin/review', b, { 'x-admin-token': token }),
    queue: (token: string) => call<{ queue: { question_id: string; prompt: string; input_key: string; display: string; n: number }[] }>('admin/queue', undefined, { 'x-admin-token': token }),
    decide: (token: string, b: { questionId: string; inputKey: string; decision: 'accept' | 'dismiss'; display?: string; tier?: number }) =>
      call<{ ok: boolean }>('admin/decide', b, { 'x-admin-token': token }),
    setup: (token: string) => call<{ questions: number }>('setup', {}, { 'x-admin-token': token }),
    names: (token: string) => call<{ names: { player_id: string; name: string | null; score: number; muted: boolean }[] }>('admin/names', undefined, { 'x-admin-token': token }),
    flags: (token: string) => call<{ flags: { player_id: string; day: string; reasons: string; score: number; status: string; name: string | null }[] }>('admin/flags', undefined, { 'x-admin-token': token }),
    flagSet: (token: string, playerId: string, day: string, status: 'cleared' | 'open') => call<{ ok: boolean }>('admin/flag-set', { playerId, day, status }, { 'x-admin-token': token }),
    safety: (token: string) =>
      call<{
        today: string;
        threshold: number;
        totals: { held: number; cleared: number };
        now: { players: number; heldToday: number; krill: number; outside: number; fast: number };
        spread: number[];
        days: { day: string; players: number; krill: number; fast: number; held: number; cleared: number }[];
        watch: { player_id: string; name: string | null; score: number; reasons: string[] }[];
      }>('admin/safety', undefined, { 'x-admin-token': token }),
    flight: (token: string, playerId: string, day: string) =>
      call<{ rows: { prompt: string; answer: string | null; tier: number | null; ms: number | null; outside: boolean; fast: boolean }[]; score: number; reasons: string[] }>(
        `admin/flight?playerId=${encodeURIComponent(playerId)}&day=${encodeURIComponent(day)}`,
        undefined,
        { 'x-admin-token': token },
      ),
    bank: (token: string) =>
      call<{
        today: string;
        totals: { book: number; live: number; retired: number; paused: number; unseen: number; daysLeft: number };
        byCategory: { name: string; n: number; retired: number }[];
        byLevel: { name: string; n: number }[];
        pop: number;
        timely: { id: string; prompt: string; until: string; daysLeft: number }[];
        items: { id: string; prompt: string; edited: boolean; category: string; level: number; pop: boolean; until: string | null; active: boolean; retired: boolean; paused: boolean; seen: boolean; plays: number; misses: number; krill: number; clever: number; avg: number }[];
        sets: { day: string; questions: { id: string; prompt: string }[] }[];
        krillToday: { id: string; prompt: string; krill: string }[];
      }>('admin/bank', undefined, { 'x-admin-token': token }),
    question: (token: string, id: string) =>
      call<{ id: string; category: string; prompt: string; note: string; until: string; status: 'active' | 'paused' | 'retired'; bookPrompt: string; bookNote: string; krillKey: string; answers: { key: string; display: string; tier: number; source: string; status: string }[] }>(
        `admin/question?id=${encodeURIComponent(id)}`,
        undefined,
        { 'x-admin-token': token },
      ),
    editQuestion: (token: string, b: { questionId: string; prompt?: string; note?: string; until?: string; reset?: boolean }) => call<{ ok: boolean }>('admin/question-edit', b, { 'x-admin-token': token }),
    editAnswer: (token: string, b: { questionId: string; key: string; display?: string; tier?: number; remove?: boolean }) => call<{ ok: boolean }>('admin/answer-edit', b, { 'x-admin-token': token }),
    addAnswer: (token: string, b: { questionId: string; display: string; tier: number; aliases?: string }) => call<{ ok: boolean }>('admin/answer-add', b, { 'x-admin-token': token }),
    edits: (token: string) =>
      call<{
        prompts: { question_id: string; prompt: string; note: string | null; updated_at: string; bookPrompt: string }[];
        answers: { question_id: string; key: string; display: string; prior_tier: number; status: string; inBook: boolean }[];
      }>('admin/edits', undefined, { 'x-admin-token': token }),
    setStatus: (token: string, questionId: string, status: 'active' | 'paused' | 'retired') => call<{ ok: boolean }>('admin/book-status', { questionId, status }, { 'x-admin-token': token }),
    exportBook: (token: string) => call<unknown>('admin/book-export', undefined, { 'x-admin-token': token }),
    pause: (token: string, questionId: string, paused: boolean) => call<{ ok: boolean }>('admin/pause', { questionId, paused }, { 'x-admin-token': token }),
    findPlayers: (token: string, q: string, sort = 'recent') =>
      call<{
        found: { player_id: string; name: string | null; account: string | null; runs: number; days: number; last_day: string; first_day: string; best: number; held: number; muted: boolean }[];
        muted: { player_id: string; at: string; name: string | null }[];
        total: number;
        named: number;
      }>(`admin/players?q=${encodeURIComponent(q)}&sort=${sort}`, undefined, { 'x-admin-token': token }),
    player: (token: string, playerId: string) =>
      call<{ runs: { day: string; mode: string; name: string | null; score: number; altitude: number }[]; flags: { day: string; reasons: string; status: string }[]; muted: boolean; firstSeen: string | null; daysPlayed: number }>(
        `admin/player?playerId=${encodeURIComponent(playerId)}`,
        undefined,
        { 'x-admin-token': token },
      ),
    unmute: (token: string, playerId: string) => call<{ ok: boolean }>('admin/unmute', { playerId }, { 'x-admin-token': token }),
    system: (token: string) =>
      call<{
        config: { k: string; ok: boolean; hint: string }[];
        nightApplied: string | null;
        bookSynced: boolean;
        referee: { calls: number; refused: number; players: number; used: number; max: number };
        nets: { k: string; n: number }[];
        tables: Record<string, number>;
        inbox: { feedback: number; reports: number; queued: number; pending: number; flags: number };
      }>('admin/system', undefined, { 'x-admin-token': token }),
    mute: (token: string, playerId: string) => call<{ ok: boolean }>('admin/mute', { playerId }, { 'x-admin-token': token }),
  },
};
