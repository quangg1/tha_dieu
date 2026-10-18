import { wikiCheck, wikiExists } from './wikidata.js';
import { looksVietnamese } from '../shared/syllable.js';
import { createHash, timingSafeEqual } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { getDb, type Db } from './db.js';
import { pickAi, pickReferee, type Referee } from './referee.js';
import * as S from './service.js';
import { NIGHT_VERDICTS } from '../shared/book/night-verdicts.js';

let ready: Promise<void> | null = null;

/** Requests one network may send in a minute. A player sends about three per question; a busy café a few dozen. */
const BURST_PER_MINUTE = Number(process.env.BURST_PER_MINUTE) || 240;

/** Creates the tables, or resyncs the questions table, the first time a server instance meets a database from another book version. */
function ensureReady(db: Db) {
  ready ??= (async () => {
    if ((await S.syncedVersion(db)) !== S.DB_VERSION) await S.setup(db);
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

type Handler = (ctx: { db: Db; body: Record<string, unknown>; query: URLSearchParams; referee: Referee; admin: boolean; dev: string; net: string; auth: string }) => Promise<unknown>;

function mode(v: unknown): S.Mode {
  return v === 'night' ? 'night' : 'daily';
}

function needToday(day: unknown): string {
  const today = S.vnToday();
  if (day !== undefined && day !== today) throw new S.GameError(409, 'Ngày chơi đã đổi. Tải lại trang để nhận chuyến bay mới.');
  return today;
}

/** Per-instance burst counter: cheap, no database write per request. Daily caps that matter stay in the database. */
const bursts = new Map<string, number>();
let burstWindow = '';
function burst(net: string, limit: number) {
  const minute = new Date().toISOString().slice(0, 16);
  if (minute !== burstWindow) {
    bursts.clear();
    burstWindow = minute;
  }
  const n = (bursts.get(net) ?? 0) + 1;
  bursts.set(net, n);
  return n <= limit;
}

/** Seconds until midnight in Vietnam, when the daily set changes. */
function untilVnMidnight() {
  const now = Date.now();
  const vn = new Date(now + 7 * 3600_000);
  const next = Date.UTC(vn.getUTCFullYear(), vn.getUTCMonth(), vn.getUTCDate() + 1) - 7 * 3600_000;
  return Math.max(1, Math.floor((next - now) / 1000));
}

const routes: Record<string, { method: 'GET' | 'POST'; admin?: boolean; cache?: () => string; run: Handler }> = {
  daily: {
    method: 'GET',
    // The same seven prompts for everyone: the CDN keeps them until midnight instead of asking the database each time.
    cache: () => `public, max-age=60, s-maxage=${untilVnMidnight()}`,
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
  // Where this player's new answers stand now (the referee may have settled them after the reply).
  newstatus: {
    method: 'POST',
    async run({ db, body }) {
      const ids = Array.isArray(body.questionIds) ? body.questionIds.map(String) : [];
      return S.newAnswerStatus(db, { playerId: S.checkPlayer(body.playerId), day: needToday(body.day), mode: mode(body.mode), questionIds: ids });
    },
  },
  // Answers this player typed that the book has learned since (told once each).
  notices: {
    method: 'POST',
    async run({ db, body }) {
      return S.notices(db, S.checkPlayer(body.playerId));
    },
  },
  // What the scheduled night-shift run reads: tomorrow's prompts and the answers waiting for a verdict.
  nightqueue: {
    method: 'GET',
    async run({ db, admin, query }) {
      const key = process.env.NIGHT_TOKEN;
      if (!admin && !(key && query.get('k') === key)) throw new S.GameError(401, 'Không được phép.');
      return S.nightQueue(db);
    },
  },
  // The night shift, called by Vercel Cron (with CRON_SECRET when set) or by the village head.
  nightly: {
    method: 'GET',
    async run({ db, admin, auth }) {
      const secret = process.env.CRON_SECRET;
      const allowed = admin || (secret ? auth === `Bearer ${secret}` : true);
      if (!allowed) throw new S.GameError(401, 'Không được phép.');
      // The scheduled Claude run's verdicts ship with the code; apply them first.
      const night = await S.applyNight(db, NIGHT_VERDICTS);
      const ai = pickAi();
      if (!ai) return { night, skipped: 'Chưa có khóa AI (GEMINI_API_KEY hoặc ANTHROPIC_API_KEY).' };
      // Without a secret, anyone could call this: once a day is all it ever does.
      if (!admin && !(await S.hit(db, 'nightly', S.vnToday(), 1))) return { night, skipped: 'Đã chạy hôm nay.' };
      return { night, ai: await S.nightShift(db, ai) };
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
      return S.finish(db, { playerId: S.checkPlayer(body.playerId), day: needToday(body.day), mode: mode(body.mode), name: body.name as string | undefined, dev, since: typeof body.since === 'string' ? body.since : undefined, runSince: typeof body.runSince === 'string' ? body.runSince : undefined });
    },
  },
  // Yesterday's answers, the hidden ones included: they open only once the day is over.
  yesterday: {
    method: 'GET',
    cache: () => 'private, max-age=300',
    async run({ db, query }) {
      const pid = query.get('playerId');
      return S.yesterday(db, pid && /^[A-Za-z0-9_-]{8,64}$/.test(pid) ? pid : undefined);
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
      const pid = typeof body.playerId === 'string' ? body.playerId : undefined;
      // Batches from the client queue; a single event is still accepted from older pages.
      const list = (Array.isArray(body.events) ? body.events : [{ name: body.name, props: body.props }]).slice(0, 20) as { name?: unknown; props?: unknown }[];
      if (!(await S.hit(db, `ev:${net}`, day, 300))) return { ok: false };
      await S.logEvents(db, day, pid, list.map((e) => ({ name: String(e?.name ?? ''), props: e?.props })));
      return { ok: true };
    },
  },
  report: {
    method: 'POST',
    async run({ db, body, net }) {
      if (!(await S.hit(db, `rp:${net}`, S.vnToday(), 60))) throw new S.GameError(429, 'Bạn đã gửi nhiều báo cáo hôm nay rồi. Cảm ơn bạn!');
      return S.report(db, { questionId: String(body.questionId), input: String(body.input ?? ''), kind: body.kind === 'accepted' ? 'accepted' : 'rejected', note: typeof body.note === 'string' ? body.note : undefined });
    },
  },
  // The admin page has no public address: it opens only at a secret path set in ADMIN_PATH, checked here.
  gate: {
    method: 'GET',
    async run({ db, query, net }) {
      const want = process.env.ADMIN_PATH ?? '';
      const got = query.get('s') ?? '';
      if (!(await S.hit(db, `gate:${net}`, S.vnToday(), 30))) return { ok: false };
      if (want.length < 12 || got.length !== want.length) return { ok: false };
      return { ok: timingSafeEqual(Buffer.from(got), Buffer.from(want)) };
    },
  },
  feedback: {
    method: 'POST',
    async run({ db, body, net }) {
      if (!(await S.hit(db, `fb:${net}`, S.vnToday(), 20))) throw new S.GameError(429, 'Bạn đã gửi nhiều góp ý hôm nay rồi. Cảm ơn bạn!');
      return S.sendFeedback(db, { kind: String(body.kind ?? ''), message: String(body.message ?? ''), contact: typeof body.contact === 'string' ? body.contact : undefined, playerId: typeof body.playerId === 'string' ? body.playerId : undefined });
    },
  },
  support: {
    method: 'GET',
    cache: () => 'public, max-age=60, s-maxage=60',
    async run({ db }) {
      return S.getSupport(db);
    },
  },
  'admin/feedback': {
    method: 'GET',
    admin: true,
    async run({ db }) {
      return { feedback: await S.listFeedback(db), support: await S.getSupport(db) };
    },
  },
  'admin/feedback-close': {
    method: 'POST',
    admin: true,
    async run({ db, body }) {
      return S.closeFeedback(db, Number(body.id));
    },
  },
  // Whether the Wikidata referee is reachable from the server, for a question that has a rule. Cheap and harmless.
  wikicheck: {
    method: 'GET',
    async run({ db, query, net }) {
      if (!(await S.hit(db, `wiki:${net}`, S.vnToday(), 30))) throw new S.GameError(429, 'Thử lại sau nhé.');
      const t0 = Date.now();
      const typed = String(query.get('s') ?? '').slice(0, 60);
      const r = await wikiCheck(String(query.get('q') ?? ''), typed);
      return { hit: r, vietnamese: looksVietnamese(typed), exists: await wikiExists(typed), ms: Date.now() - t0 };
    },
  },
  'admin/support': {
    method: 'POST',
    admin: true,
    async run({ db, body }) {
      return S.setSupport(db, body as Partial<S.Support>);
    },
  },
  // Names on today's board, to take a rude one off.
  'admin/names': {
    method: 'GET',
    admin: true,
    async run({ db }) {
      return { names: await S.adminBoard(db, S.vnToday()) };
    },
  },
  'admin/mute': {
    method: 'POST',
    admin: true,
    async run({ db, body }) {
      return S.mutePlayer(db, S.checkPlayer(body.playerId));
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

function send(res: ServerResponse, status: number, data: unknown, cache?: string) {
  res.statusCode = status;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('cache-control', status === 200 && cache ? cache : 'no-store');
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
  const sent = Buffer.from(String(req.headers['x-admin-token'] ?? ''));
  const admin = !!token && sent.length === Buffer.byteLength(token) && timingSafeEqual(sent, Buffer.from(token));
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
      if (!burst(net, BURST_PER_MINUTE)) return send(res, 429, { error: 'Bạn thao tác nhanh quá. Chờ một chút rồi thử lại nhé.' });
      if (Math.random() < 0.005) S.sweepLimits(db).catch(() => {});
    }
    const data = await r.run({ db, body, query: url.searchParams, referee: opts.referee ?? pickReferee(), admin, dev, net, auth: String(req.headers.authorization ?? '') });
    send(res, 200, data, r.cache?.());
  } catch (e) {
    if (e instanceof S.GameError) return send(res, e.status, { error: e.message });
    if (e instanceof SyntaxError) return send(res, 400, { error: 'Dữ liệu gửi lên không đọc được.' });
    console.error(e);
    send(res, 500, { error: 'Máy chủ gặp lỗi. Thử lại sau ít phút.' });
  }
}
