import type { TierIndex } from '../shared/scoring.js';

export interface PublicQuestion {
  id: string;
  category: string;
  prompt: string;
  note: string | null;
  /** How many answers the village book holds for this prompt. */
  pool?: number;
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
  krill: string;
  top: string;
  mine: string | null;
  tier: number;
}

export interface AnswerResult {
  status: 'landed' | 'retry' | 'nothing' | 'late' | 'confirm' | 'vague' | 'empty';
  input?: string;
  suggestion?: string;
  reason?: string;
  display?: string;
  tier?: TierIndex;
  points?: number;
  bonus?: number;
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
  reveal?: Reveal[];
}

export interface BoardRow {
  rank: number;
  name: string;
  altitude: number;
  score: number;
  me: boolean;
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
  if (!res.ok) throw new ApiError(res.status, data.error || 'Máy chủ gặp lỗi.');
  return data as T;
}

export const api = {
  daily: () => call<{ day: string; questions: PublicQuestion[] }>('daily'),
  night: (seen: string[]) => call<{ day: string; question: PublicQuestion }>('night', { seen }),
  start: (b: { playerId: string; day: string; mode: string; questionId: string }) =>
    call<{ startedAt: string; now: string; answered: boolean }>('start', b),
  answer: (b: { playerId: string; day: string; mode: string; questionId: string; input: string }) => call<AnswerResult>('answer', b),
  miss: (b: { playerId: string; day: string; mode: string; questionId: string }) => call<{ ok: boolean }>('miss', b),
  finish: (b: { playerId: string; day: string; mode: string; name?: string; since?: string }) => call<FinishResult>('finish', b),
  board: (mode: string, playerId: string) => call<{ players: number; settled?: boolean; rows: BoardRow[] }>(`board?mode=${mode}&playerId=${encodeURIComponent(playerId)}`),
  report: (b: { questionId: string; input: string; kind: 'rejected' | 'accepted'; note?: string }) => call<{ ok: boolean }>('report', b),
  admin: {
    insights: (token: string) =>
      call<{
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
  },
};
