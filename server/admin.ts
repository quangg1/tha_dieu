import { BOOK_BY_ID as CODE } from '../shared/book/questions.js';
import * as bk from './book.js';
import { UNTIL } from '../shared/book/release.js';
import type { Db } from './db.js';
import { DB_VERSION, GameError, dayQuestion, forgetBoard, forgetQuestion, isPop, loadQuestion, syncedVersion, vnToday } from './service.js';
import { soft } from '../shared/normalize.js';
import type { QuestionDef } from '../shared/match.js';

/* The village head's pages beyond the day's numbers: the question bank, players, and the state of the system. */

/** Takes a prompt out of play, brings it back, or retires it, without a deploy. */
export async function adminSetStatus(db: Db, id: string, status: bk.Status) {
  await bk.ensureBook(db);
  const def = bk.get(id);
  if (!def) throw new GameError(404, 'Không tìm thấy câu hỏi.');
  if (!['active', 'paused', 'retired'].includes(status)) throw new GameError(400, 'Trạng thái không hợp lệ.');
  await bk.save(db, def, { status, statusOnly: true });
  forgetQuestion(id);
  return { ok: true };
}

/** Pause or resume: kept for the dashboard's button. */
export const adminPause = (db: Db, id: string, paused: boolean) => adminSetStatus(db, id, paused ? 'paused' : 'active');

/** The whole question bank at a glance: what is in it, how long it lasts, what is about to expire, how each prompt plays. */
export async function adminBank(db: Db) {
  await bk.ensureBook(db);
  const today = vnToday();
  const drawn = await db.query<{ day: string; question_ids: string[] }>(`select day::text as day, question_ids from daily_sets order by day`);
  const seen = new Set(drawn.flatMap((d) => d.question_ids));
  const stat = new Map(
    (
      await db.query<{ question_id: string; plays: number; misses: number; krill: number; clever: number; avg: number }>(
        `select question_id,
                count(*) filter (where answered_at is not null and tier >= 0)::int as plays,
                count(*) filter (where tier = -1)::int as misses,
                count(*) filter (where tier = 5)::int as krill,
                count(*) filter (where tier = 6)::int as clever,
                coalesce(round(avg(points) filter (where tier >= 0)), 0)::int as avg
         from turns where mode='daily' group by question_id`,
      )
    ).map((r) => [r.question_id, r]),
  );
  const items = bk.all().map((q) => {
    const s = stat.get(q.id);
    const st = bk.status(q.id)!;
    const code = CODE.get(q.id);
    return {
      id: q.id,
      prompt: q.prompt,
      edited: !!code && (code.prompt !== q.prompt || (code.note ?? '') !== (q.note ?? '')),
      category: q.category,
      level: q.level ?? 2,
      pop: isPop(q),
      until: bk.until(q.id),
      active: st === 'active',
      retired: st === 'retired',
      paused: st === 'paused',
      seen: seen.has(q.id),
      plays: s?.plays ?? 0,
      misses: s?.misses ?? 0,
      krill: s?.krill ?? 0,
      clever: s?.clever ?? 0,
      avg: s?.avg ?? 0,
    };
  });
  const live = items.filter((i) => i.active && !(i.until && i.until < today));
  const count = (f: (i: (typeof items)[number]) => string) => {
    const m = new Map<string, number>();
    for (const i of live) m.set(f(i), (m.get(f(i)) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]).map(([name, n]) => ({ name, n }));
  };
  const unseen = live.filter((i) => !i.seen).length;
  const day = (id: string) => ({ id, prompt: bk.get(id)?.prompt ?? id });
  const sets = drawn
    .filter((d) => d.day >= vnToday(new Date(Date.now() - 6 * 86_400_000)))
    .reverse()
    .map((d) => ({ day: d.day, questions: d.question_ids.map(day) }));
  // The hidden answers of today's flight, so the village head can check them against the day's play.
  const todaySet = drawn.find((d) => d.day === today)?.question_ids ?? [];
  const krillToday = await Promise.all(
    todaySet.map(async (id) => {
      const q = await dayQuestion(db, today, id);
      return { id, prompt: q.prompt, krill: q.answers.get(q.krillKey)?.display ?? q.krillKey };
    }),
  );
  return {
    today,
    totals: { book: items.length, live: live.length, retired: items.filter((i) => i.retired).length, paused: items.filter((i) => i.paused).length, unseen, daysLeft: Math.floor(unseen / 7) },
    byCategory: count((i) => i.category).map((c) => ({ ...c, retired: items.filter((i) => i.category === c.name && !i.active && !i.paused).length })),
    byLevel: count((i) => ['dễ', 'vừa', 'khó'][i.level - 1] ?? String(i.level)),
    pop: live.filter((i) => i.pop).length,
    timely: live
      .filter((i) => i.until)
      .map((i) => ({ id: i.id, prompt: i.prompt, until: i.until!, daysLeft: Math.round((Date.parse(i.until!) - Date.parse(today)) / 86_400_000) }))
      .sort((a, b) => a.until.localeCompare(b.until)),
    items,
    sets,
    krillToday,
  };
}

/** The whole book as the database holds it, for a backup the village head can keep. */
export async function adminExport(db: Db) {
  await bk.ensureBook(db);
  return { at: new Date().toISOString(), version: DB_VERSION, questions: bk.all().map((def) => ({ def, status: bk.status(def.id), until: bk.until(def.id) })) };
}

/** Lists players (the most recently active first, or by best score / most flights) and finds them by the start of their id or a part of their name; also lists the muted ones. */
export async function adminFindPlayers(db: Db, q: string, sort = 'recent') {
  const needle = q.trim().slice(0, 40);
  const search = needle.length >= 2;
  const order = sort === 'best' ? 'max(r.score) desc, max(r.day) desc' : sort === 'runs' ? 'count(*) desc, max(r.day) desc' : 'max(r.day) desc, max(r.created_at) desc';
  const found = await db.query<{ player_id: string; name: string | null; account: string | null; runs: number; days: number; last_day: string; first_day: string; best: number; held: number; muted: boolean }>(
    `select r.player_id,
            (array_agg(r.name order by r.created_at desc) filter (where r.name is not null))[1] as name,
            (select a.name from accounts a where a.player_id = r.player_id) as account,
            count(*)::int as runs, count(distinct r.day)::int as days,
            max(r.day)::text as last_day, min(r.day)::text as first_day, max(r.score)::int as best,
            (select count(*)::int from flags f where f.player_id = r.player_id and f.status = 'open') as held,
            exists (select 1 from muted m where m.player_id = r.player_id) as muted
     from runs r ${search ? 'where starts_with(r.player_id, $1) or strpos(lower(r.name), lower($1)) > 0' : ''}
     group by r.player_id order by ${order} limit ${search ? 20 : 60}`,
    search ? [needle] : [],
  );
  const [t] = await db.query<{ players: number; named: number }>(
    `select count(distinct player_id)::int as players, count(distinct player_id) filter (where name is not null)::int as named from runs`,
  );
  const muted = await db.query<{ player_id: string; at: string; name: string | null }>(
    `select m.player_id, m.at::text as at,
            (select r.name from runs r where r.player_id = m.player_id and r.name is not null order by r.created_at desc limit 1) as name
     from muted m order by m.at desc limit 50`,
  );
  return { found, muted, total: t?.players ?? 0, named: t?.named ?? 0 };
}

/** One player's recent flights, flags and mute, for a complaint like "my score vanished". */
export async function adminPlayer(db: Db, playerId: string) {
  const runs = await db.query<{ day: string; mode: string; name: string | null; score: number; altitude: number }>(
    `select day::text as day, mode, name, score, altitude from runs where player_id=$1 order by day desc, mode limit 40`,
    [playerId],
  );
  const flags = await db.query<{ day: string; reasons: string; status: string }>(`select day::text as day, reasons, status from flags where player_id=$1 order by day desc`, [playerId]);
  const [m] = await db.query<{ n: number }>(`select count(*)::int as n from muted where player_id=$1`, [playerId]);
  const [ev] = await db.query<{ first: string | null; days: number }>(`select min(day)::text as first, count(distinct day)::int as days from events where player_id=$1`, [playerId]);
  return { runs, flags, muted: !!m?.n, firstSeen: ev?.first ?? null, daysPlayed: ev?.days ?? 0 };
}

/** Gives a muted player their name rights back (the name they had is not restored). */
export async function adminUnmute(db: Db, playerId: string) {
  await db.query(`delete from muted where player_id=$1`, [playerId]);
  forgetBoard();
  return { ok: true };
}

/** What is set up, what ran, what the AI referee and the limits have used, and what is waiting for the village head. Never any secret value. */
export async function adminSystem(db: Db) {
  const today = vnToday();
  const env = (k: string) => !!process.env[k];
  const pooled = /-pooler/.test(process.env.POSTGRES_URL ?? '');
  const config = [
    { k: 'ADMIN_TOKEN', ok: env('ADMIN_TOKEN'), hint: 'Mã vào trang này.' },
    { k: 'ADMIN_PATH', ok: env('ADMIN_PATH'), hint: 'Đường dẫn bí mật của trang quản trị.' },
    { k: 'CRON_SECRET', ok: env('CRON_SECRET'), hint: 'Khóa cho Vercel Cron. Chưa đặt thì /api/nightly còn mở cho cả gọi bằng mã đêm.' },
    { k: 'NIGHT_TOKEN', ok: env('NIGHT_TOKEN'), hint: 'Mã cho ca đêm gọi từ ngoài.' },
    { k: 'Trọng tài AI', ok: env('ANTHROPIC_API_KEY') || env('GEMINI_API_KEY'), hint: 'Cần một trong hai: ANTHROPIC_API_KEY hoặc GEMINI_API_KEY. Thiếu thì làng tự xét đáp án lạ.' },
    { k: 'Kết nối pooler', ok: pooled, hint: 'POSTGRES_URL có “-pooler”: chịu được nhiều người chơi cùng lúc.' },
  ];
  const [applied] = await db.query<{ value: string }>(`select value from meta where key='night_applied'`);
  const synced = await syncedVersion(db);
  const [ref] = await db.query<{ calls: number; refused: number; players: number }>(
    `select coalesce(sum(calls),0)::int as calls, coalesce(sum(refused),0)::int as refused, count(*)::int as players from referee_usage where day=$1::date`,
    [today],
  );
  const [refAll] = await db.query<{ n: number }>(`select n from limits where k='ref:all' and win=$1`, [today]);
  const nets = await db.query<{ k: string; n: number }>(
    `select k, n from limits where win=$1 and (k like 'an:%' or k like 'nq:%' or k like 'yl:%') order by n desc limit 8`,
    [today],
  );
  const [t] = await db.query<Record<string, number>>(
    `select (select count(*) from runs)::int as runs, (select count(*) from turns)::int as turns, (select count(*) from events)::int as events,
            (select count(*) from answers)::int as answers, (select count(*) from submissions)::int as submissions,
            (select count(*) from feedback)::int as feedback, (select count(*) from flags)::int as flags, (select count(*) from muted)::int as muted,
            (select count(*) from accounts)::int as accounts`,
  );
  const [inbox] = await db.query<{ feedback: number; reports: number; queued: number; pending: number; flags: number }>(
    `select (select count(*) from feedback where status='open')::int as feedback,
            (select count(*) from reports where status='open')::int as reports,
            (select count(*) from submissions where status='open')::int as queued,
            (select count(*) from answers where status='pending')::int as pending,
            (select count(*) from flags where status='open')::int as flags`,
  );
  return {
    config,
    nightApplied: applied?.value ?? null,
    bookSynced: synced === DB_VERSION,
    referee: { calls: ref?.calls ?? 0, refused: ref?.refused ?? 0, players: ref?.players ?? 0, used: refAll?.n ?? 0, max: Number(process.env.REFEREE_DAILY_MAX) || 450 },
    nets: nets.map((x) => ({ k: `${x.k.split(':')[0]}:${x.k.split(':')[1]?.slice(0, 6) ?? ''}`, n: x.n })),
    tables: t,
    inbox,
  };
}

/* ------------------------------------------------------------------ editing from the admin page */

const text = (v: unknown, max: number) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, max);
const tierOf = (v: unknown) => {
  const n = Number(v);
  if (!Number.isInteger(n) || n < 0 || n > 4) throw new GameError(400, 'Bậc phải từ Thường đến Cực hiếm.');
  return n;
};

/** One prompt with every answer the village knows, for the editor. */
export async function adminQuestion(db: Db, id: string) {
  await bk.ensureBook(db);
  const base = bk.get(id);
  if (!base) throw new GameError(404, 'Không tìm thấy câu hỏi.');
  const q = await loadQuestion(db, id);
  const answers = [...q.answers.entries()]
    .filter(([, e]) => !(e.status === 'pending' && e.source === 'crowd'))
    .map(([key, e]) => ({ key, display: e.display, tier: key === q.krillKey ? 5 : e.prior, source: e.source ?? 'seed', status: e.status }))
    .sort((a, b) => b.tier - a.tier || a.display.localeCompare(b.display, 'vi'));
  const code = CODE.get(id);
  return {
    id,
    category: q.category,
    prompt: q.prompt,
    note: q.note ?? '',
    until: bk.until(id) ?? '',
    status: bk.status(id)!,
    bookPrompt: code?.prompt ?? base.prompt,
    bookNote: code?.note ?? '',
    krillKey: q.krillKey,
    answers,
  };
}

/** Changes the words of a prompt, its note, or its last day (timely prompts). Scoring and counts are untouched. */
export async function adminEditQuestion(db: Db, id: string, prompt: unknown, note: unknown, until?: unknown) {
  await bk.ensureBook(db);
  const cur = bk.get(id);
  if (!cur) throw new GameError(404, 'Không tìm thấy câu hỏi.');
  const p = text(prompt, 200);
  if (p.length < 8) throw new GameError(400, 'Câu hỏi quá ngắn.');
  const n = text(note, 300);
  const def: QuestionDef = { ...cur, prompt: p };
  if (n) def.note = n;
  else delete def.note;
  let un: string | null | undefined;
  if (until !== undefined) {
    const u = String(until ?? '').trim();
    if (u && !/^\d{4}-\d{2}-\d{2}$/.test(u)) throw new GameError(400, 'Ngày hết hạn phải có dạng năm-tháng-ngày.');
    un = u || null;
  }
  await bk.save(db, def, { until: un });
  forgetQuestion(id);
  return { ok: true };
}

/** Puts a prompt back as the files in code have it, dropping every change made to it on the page; it follows the files again. */
export async function adminResetQuestion(db: Db, id: string) {
  await bk.ensureBook(db);
  const code = CODE.get(id);
  if (!bk.get(id) || !code) throw new GameError(404, 'Không tìm thấy câu hỏi.');
  await bk.save(db, JSON.parse(JSON.stringify(code)) as QuestionDef, { until: UNTIL.get(id) ?? null, follow: true });
  forgetQuestion(id);
  return { ok: true };
}

/** Renames an answer, moves it to another tier, or takes it out. The key stays, so its counts and history stay with it. */
export async function adminEditAnswer(db: Db, a: { questionId: string; key: string; display?: unknown; tier?: unknown; remove?: boolean }) {
  await bk.ensureBook(db);
  const q = await loadQuestion(db, a.questionId);
  const cur = q.answers.get(a.key);
  if (!cur) throw new GameError(404, 'Không tìm thấy đáp án này.');
  const isKrill = a.key === q.krillKey;
  if (a.remove && isKrill) throw new GameError(400, 'Đây là đáp án làng giấu của câu này: đổi tên được, nhưng không gỡ ở đây.');
  const def = bk.get(a.questionId)!;
  const entry = def.answers.find((x) => x.key === a.key);
  const display = a.display === undefined ? cur.display : text(a.display, 60);
  if (!a.remove && !display) throw new GameError(400, 'Tên đáp án trống.');
  const tier = a.tier === undefined || isKrill ? cur.prior : tierOf(a.tier);
  if (entry) {
    // An answer of the book itself: changed in the book.
    const next: QuestionDef = { ...def, answers: def.answers.map((x) => ({ ...x, aliases: [...x.aliases] })) };
    if (a.remove) next.answers = next.answers.filter((x) => x.key !== a.key);
    else {
      const e = next.answers.find((x) => x.key === a.key)!;
      e.display = display;
      e.priorTier = isKrill ? e.priorTier : tier;
      if (!e.aliases.includes(display)) e.aliases.push(display);
    }
    await bk.save(db, next);
  } else if (a.remove) {
    // An answer players or the referee added: out of the book for good.
    await db.query(`update answers set status='rejected' where question_id=$1 and key=$2`, [a.questionId, a.key]);
  } else {
    await db.query(`update answers set display=$3, prior_tier=$4, status='approved' where question_id=$1 and key=$2`, [a.questionId, a.key, display, tier]);
  }
  if (!a.remove) {
    // Whoever types the new name finds it, and the old one still works.
    await db.query(`insert into aliases (question_id, alias, key) values ($1,$2,$3) on conflict (question_id, alias) do update set key=excluded.key`, [a.questionId, soft(display), a.key]);
  }
  forgetQuestion(a.questionId);
  return { ok: true };
}

/** Adds an answer the book lacks, with the names people also use for it. */
export async function adminAddAnswer(db: Db, a: { questionId: string; display: unknown; tier: unknown; aliases?: unknown }) {
  await bk.ensureBook(db);
  const q = await loadQuestion(db, a.questionId);
  const def = bk.get(a.questionId)!;
  const display = text(a.display, 60);
  if (!display) throw new GameError(400, 'Tên đáp án trống.');
  const tier = tierOf(a.tier);
  const found = q.matcher.match(display);
  if (found?.exact || q.answers.has(soft(display))) throw new GameError(409, 'Đáp án này đã có trong sổ.');
  const key = soft(display);
  const names = String(a.aliases ?? '')
    .split(/[,|]/)
    .map((x) => text(x, 60))
    .filter(Boolean)
    .slice(0, 10);
  const aliases = [display, ...names.filter((n) => soft(n) !== key)];
  await bk.save(db, { ...def, answers: [...def.answers, { key, display, priorTier: tier, aliases }] });
  forgetQuestion(a.questionId);
  return { ok: true };
}

/** Where the database's book differs from the files in code, so the files can be brought back in line (or left behind on purpose). */
export async function adminEdits(db: Db) {
  await bk.ensureBook(db);
  const prompts: { question_id: string; prompt: string; note: string | null; bookPrompt: string }[] = [];
  const answers: { question_id: string; display: string; prior_tier: number; status: string; inBook: boolean }[] = [];
  for (const def of bk.all()) {
    const code = CODE.get(def.id);
    if (!code) continue;
    if (code.prompt !== def.prompt || (code.note ?? '') !== (def.note ?? '')) prompts.push({ question_id: def.id, prompt: def.prompt, note: def.note ?? null, bookPrompt: code.prompt });
    const codeBy = new Map(code.answers.map((x) => [x.key, x]));
    const dbBy = new Map(def.answers.map((x) => [x.key, x]));
    for (const x of def.answers) {
      const c = codeBy.get(x.key);
      if (!c) answers.push({ question_id: def.id, display: x.display, prior_tier: x.priorTier, status: 'approved', inBook: false });
      else if (c.display !== x.display || c.priorTier !== x.priorTier) answers.push({ question_id: def.id, display: x.display, prior_tier: x.priorTier, status: 'approved', inBook: true });
    }
    for (const c of code.answers) if (!dbBy.has(c.key)) answers.push({ question_id: def.id, display: c.display, prior_tier: c.priorTier, status: 'rejected', inBook: true });
  }
  return { prompts: prompts.map((p) => ({ ...p, updated_at: '' })), answers: answers.map((x) => ({ ...x, key: soft(x.display) })) };
}
