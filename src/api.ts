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
  top: { display: string; pct: number; mine: boolean }[];
  mine: number;
  estimated: boolean;
}

export interface AnswerResult {
  status: 'landed' | 'nothing' | 'late' | 'confirm' | 'vague' | 'empty';
  input?: string;
  suggestion?: string;
  reason?: string;
  display?: string;
  tier?: TierIndex;
  points?: number;
  bonus?: number;
  judged?: boolean;
  share?: number | null;
}

export interface FinishResult {
  score: number;
  altitude: number;
  grid: string;
  rank: number;
  players: number;
  beaten: number;
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
  finish: (b: { playerId: string; day: string; mode: string; name?: string }) => call<FinishResult>('finish', b),
  board: (mode: string, playerId: string) => call<{ players: number; rows: BoardRow[] }>(`board?mode=${mode}&playerId=${encodeURIComponent(playerId)}`),
  admin: {
    pending: (token: string) => call<{ stats: Record<string, number>; pending: { question_id: string; prompt: string; key: string; display: string; plays: number }[] }>('admin/pending', undefined, { 'x-admin-token': token }),
    review: (token: string, b: { questionId: string; key: string; decision: 'approve' | 'reject'; tier?: number }) =>
      call<{ ok: boolean }>('admin/review', b, { 'x-admin-token': token }),
    queue: (token: string) => call<{ queue: { question_id: string; prompt: string; input_key: string; display: string; n: number }[] }>('admin/queue', undefined, { 'x-admin-token': token }),
    decide: (token: string, b: { questionId: string; inputKey: string; decision: 'accept' | 'dismiss'; display?: string; tier?: number }) =>
      call<{ ok: boolean }>('admin/decide', b, { 'x-admin-token': token }),
    setup: (token: string) => call<{ questions: number }>('setup', {}, { 'x-admin-token': token }),
  },
};
