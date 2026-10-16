import { createHash } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { getDb, type Db } from './db.js';
import { pickReferee, type Referee } from './referee.js';
import * as S from './service.js';
import { BOOK_VERSION } from '../shared/book/questions.js';

let ready: Promise<void> | null = null;

/** Requests one network may send in a minute. A player sends about three per question; a busy café a few dozen. */
const BURST_PER_MINUTE = Number(process.env.BURST_PER_MINUTE) || 240;

/** Creates the tables, or resyncs the questions table, the first time a server instance meets a database from another book version. */
function ensureReady(db: Db) {
  ready ??= (async () => {
    if ((await S.syncedVersion(db)) !== BOOK_VERSION) await S.setup(db);
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

type Handler = (ctx: { db: Db; body: Record<string, unknown>; query: URLSearchParams; referee: Referee; admin: boolean; dev: string; net: string }) => Promise<unknown>;

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
    async run({ db, body, referee, net }) {
      return S.answer(
        db,
        { playerId: S.checkPlayer(body.playerId), day: needToday(body.day), mode: mode(body.mode), questionId: String(body.questionId), input: String(body.input ?? ''), net },
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
    async run({ db, body, dev }) {
      return S.finish(db, { playerId: S.checkPlayer(body.playerId), day: needToday(body.day), mode: mode(body.mode), name: body.name as string | undefined, dev, since: typeof body.since === 'string' ? body.since : undefined });
    },
  },
  board: {
    method: 'GET',
    async run({ db, query }) {
      return S.board(db, S.vnToday(), mode(query.get('mode')), query.get('playerId') ?? undefined);
    },
  },
  event: {
    method: 'POST',
    async run({ db, body, net }) {
      const day = S.vnToday();
      if (!(await S.hit(db, `ev:${net}`, day, 3000))) return { ok: false };
      return S.logEvent(db, { day, name: String(body.name ?? ''), playerId: typeof body.playerId === 'string' ? body.playerId : undefined, props: body.props });
    },
  },
  report: {
    method: 'POST',
    async run({ db, body, net }) {
      if (!(await S.hit(db, `rp:${net}`, S.vnToday(), 60))) throw new S.GameError(429, 'Bạn đã gửi nhiều báo cáo hôm nay rồi. Cảm ơn bạn!');
      return S.report(db, { questionId: String(body.questionId), input: String(body.input ?? ''), kind: body.kind === 'accepted' ? 'accepted' : 'rejected', note: typeof body.note === 'string' ? body.note : undefined });
    },
  },
  'admin/insights': {
    method: 'GET',
    admin: true,
    async run({ db }) {
      return { ...(await S.insights(db)), reports: await S.reports(db) };
    },
  },
  'admin/report': {
    method: 'POST',
    admin: true,
    async run({ db, body }) {
      return S.closeReport(db, { questionId: String(body.questionId), inputKey: String(body.inputKey), kind: String(body.kind) });
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
    // A coarse device mark (network address and browser), hashed, so a replay in a private tab stays off the board.
    const ip = String(req.headers['x-forwarded-for'] ?? req.socket?.remoteAddress ?? '').split(',')[0].trim();
    const dev = createHash('sha256').update(`${ip}|${req.headers['user-agent'] ?? ''}`).digest('hex').slice(0, 24);
    const net = createHash('sha256').update(`net|${ip}`).digest('hex').slice(0, 24);
    // A burst limit per network on everything players send, so a script cannot flood the counts or the referee.
    if (req.method === 'POST' && !r.admin && !admin) {
      const minute = new Date().toISOString().slice(0, 16);
      if (!(await S.hit(db, `b:${net}`, minute, BURST_PER_MINUTE))) return send(res, 429, { error: 'Bạn thao tác nhanh quá. Chờ một chút rồi thử lại nhé.' });
      if (Math.random() < 0.005) S.sweepLimits(db).catch(() => {});
    }
    const data = await r.run({ db, body, query: url.searchParams, referee: opts.referee ?? pickReferee(), admin, dev, net });
    send(res, 200, data);
  } catch (e) {
    if (e instanceof S.GameError) return send(res, e.status, { error: e.message });
    if (e instanceof SyntaxError) return send(res, 400, { error: 'Dữ liệu gửi lên không đọc được.' });
    console.error(e);
    send(res, 500, { error: 'Máy chủ gặp lỗi. Thử lại sau ít phút.' });
  }
}
