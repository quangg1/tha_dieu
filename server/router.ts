import type { IncomingMessage, ServerResponse } from 'node:http';
import { getDb, type Db } from './db.js';
import { pickReferee, type Referee } from './referee.js';
import * as S from './service.js';
import { BANK } from '../shared/bank.js';

let ready: Promise<void> | null = null;

/** Creates the tables and loads the question bank the first time a server instance meets an empty or older database. */
function ensureReady(db: Db) {
  ready ??= (async () => {
    let n = 0;
    try {
      n = (await db.query<{ n: number }>(`select count(*)::int as n from questions`))[0].n;
    } catch {
      n = 0;
    }
    if (n < BANK.length) await S.setup(db);
  })().catch((e) => {
    ready = null;
    throw e;
  });
  return ready;
}

export interface Req extends IncomingMessage {
  body?: unknown;
  query?: Record<string, string | string[] | undefined>;
}

type Handler = (ctx: { db: Db; body: Record<string, unknown>; query: URLSearchParams; referee: Referee; admin: boolean }) => Promise<unknown>;

function mode(v: unknown): S.Mode {
  return v === 'night' ? 'night' : 'daily';
}

function needToday(day: unknown): string {
  const today = S.vnToday();
  if (day !== undefined && day !== today) throw new S.GameError(409, 'Ngày chơi đã đổi. Tải lại trang để nhận chuyến bay mới.');
  return today;
}

const routes: Record<string, { method: 'GET' | 'POST'; admin?: boolean; run: Handler }> = {
  daily: {
    method: 'GET',
    async run({ db }) {
      const day = S.vnToday();
      const ids = await S.dailySet(db, day);
      const questions = await Promise.all(ids.map(async (id) => S.publicQuestion(await S.loadQuestion(db, id))));
      return { day, questions };
    },
  },
  start: {
    method: 'POST',
    async run({ db, body }) {
      const m = mode(body.mode);
      return S.startTurn(db, { playerId: S.checkPlayer(body.playerId), day: needToday(body.day), mode: m, questionId: String(body.questionId) });
    },
  },
  answer: {
    method: 'POST',
    async run({ db, body, referee }) {
      return S.answer(
        db,
        { playerId: S.checkPlayer(body.playerId), day: needToday(body.day), mode: mode(body.mode), questionId: String(body.questionId), input: String(body.input ?? '') },
        referee,
      );
    },
  },
  miss: {
    method: 'POST',
    async run({ db, body }) {
      return S.miss(db, { playerId: S.checkPlayer(body.playerId), day: needToday(body.day), mode: mode(body.mode), questionId: String(body.questionId) });
    },
  },
  night: {
    method: 'POST',
    async run({ db, body }) {
      const seen = Array.isArray(body.seen) ? body.seen.map(String) : [];
      return { day: S.vnToday(), question: await S.nightQuestion(db, seen) };
    },
  },
  finish: {
    method: 'POST',
    async run({ db, body }) {
      return S.finish(db, { playerId: S.checkPlayer(body.playerId), day: needToday(body.day), mode: mode(body.mode), name: body.name as string | undefined });
    },
  },
  board: {
    method: 'GET',
    async run({ db, query }) {
      return S.board(db, S.vnToday(), mode(query.get('mode')), query.get('playerId') ?? undefined);
    },
  },
  setup: {
    method: 'POST',
    admin: true,
    async run({ db }) {
      return S.setup(db);
    },
  },
  'admin/pending': {
    method: 'GET',
    admin: true,
    async run({ db }) {
      return { stats: await S.stats(db, S.vnToday()), pending: await S.pending(db) };
    },
  },
  'admin/queue': {
    method: 'GET',
    admin: true,
    async run({ db }) {
      return { queue: await S.submissions(db) };
    },
  },
  'admin/decide': {
    method: 'POST',
    admin: true,
    async run({ db, body }) {
      return S.decideSubmission(db, {
        questionId: String(body.questionId),
        inputKey: String(body.inputKey),
        decision: body.decision === 'dismiss' ? 'dismiss' : 'accept',
        display: typeof body.display === 'string' ? body.display : undefined,
        tier: body.tier as number | undefined,
      });
    },
  },
  'admin/review': {
    method: 'POST',
    admin: true,
    async run({ db, body }) {
      const decision = body.decision === 'reject' ? 'reject' : 'approve';
      return S.review(db, { questionId: String(body.questionId), key: String(body.key), decision, tier: body.tier as number | undefined });
    },
  },
};

async function readBody(req: Req): Promise<Record<string, unknown>> {
  if (req.body && typeof req.body === 'object') return req.body as Record<string, unknown>;
  if (typeof req.body === 'string') return req.body ? JSON.parse(req.body) : {};
  const chunks: Buffer[] = [];
  for await (const c of req) chunks.push(c as Buffer);
  const text = Buffer.concat(chunks).toString('utf8');
  return text ? JSON.parse(text) : {};
}

function send(res: ServerResponse, status: number, data: unknown) {
  res.statusCode = status;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('cache-control', 'no-store');
  res.end(JSON.stringify(data));
}

/** Handles every /api/* request. Used by the Vercel function and by the local dev server. */
export async function route(req: Req, res: ServerResponse, opts: { referee?: Referee; db?: Db } = {}) {
  const url = new URL(req.url || '/', 'http://local');
  const path = url.pathname.replace(/^\/api\/?/, '').replace(/\/$/, '');
  const r = routes[path];
  if (!r) return send(res, 404, { error: 'Không có đường dẫn này.' });
  if (req.method !== r.method) return send(res, 405, { error: 'Sai phương thức.' });
  const token = process.env.ADMIN_TOKEN;
  const admin = !!token && req.headers['x-admin-token'] === token;
  if (r.admin && !admin) return send(res, 401, { error: 'Cần mã quản trị.' });
  try {
    const body = req.method === 'POST' ? await readBody(req) : {};
    const db = opts.db ?? (await getDb());
    if (!opts.db) await ensureReady(db);
    const data = await r.run({ db, body, query: url.searchParams, referee: opts.referee ?? pickReferee(), admin });
    send(res, 200, data);
  } catch (e) {
    if (e instanceof S.GameError) return send(res, e.status, { error: e.message });
    if (e instanceof SyntaxError) return send(res, 400, { error: 'Dữ liệu gửi lên không đọc được.' });
    console.error(e);
    send(res, 500, { error: 'Máy chủ gặp lỗi. Thử lại sau ít phút.' });
  }
}
