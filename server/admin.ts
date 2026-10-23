import { BOOK, BOOK_BY_ID, RETIRED } from '../shared/book/questions.js';
import { UNTIL } from '../shared/book/release.js';
import type { Db } from './db.js';
import { DB_VERSION, GameError, dayQuestion, forgetBoard, forgetQuestion, isPop, loadQuestion, syncedVersion, vnToday } from './service.js';
import { soft } from '../shared/normalize.js';

/* The village head's pages beyond the day's numbers: the question bank, players, and the state of the system. */

async function pausedIds(db: Db): Promise<Set<string>> {
  const [r] = await db.query<{ value: string }>(`select value from meta where key='paused'`);
  try {
    return new Set((JSON.parse(r?.value ?? '[]') as unknown[]).map(String));
  } catch {
    return new Set();
  }
}

/** Takes a prompt out of play (or puts it back) without a deploy. A resync keeps it paused. */
export async function adminPause(db: Db, id: string, paused: boolean) {
  if (!BOOK_BY_ID.has(id)) throw new GameError(404, 'Không tìm thấy câu hỏi.');
  const set = await pausedIds(db);
  if (paused) set.add(id);
  else set.delete(id);
  await db.query(`insert into meta (key, value) values ('paused', $1) on conflict (key) do update set value=excluded.value`, [JSON.stringify([...set])]);
  await db.query(`update questions set active=$2 where id=$1`, [id, !paused && !RETIRED.has(id)]);
  forgetQuestion(id);
  return { ok: true };
}

/** The whole question bank at a glance: what is in it, how long it lasts, what is about to expire, how each prompt plays. */
export async function adminBank(db: Db) {
  const today = vnToday();
  const active = new Set((await db.query<{ id: string }>(`select id from questions where active`)).map((r) => r.id));
  const paused = await pausedIds(db);
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
  const edited = new Map((await db.query<{ question_id: string; prompt: string }>(`select question_id, prompt from question_edits`)).map((r) => [r.question_id, r.prompt]));
  const items = BOOK.map((q) => {
    const s = stat.get(q.id);
    return {
      id: q.id,
      prompt: edited.get(q.id) ?? q.prompt,
      edited: edited.has(q.id),
      category: q.category,
      level: q.level ?? 2,
      pop: isPop(q),
      until: UNTIL.get(q.id) ?? null,
      active: active.has(q.id),
      retired: RETIRED.has(q.id),
      paused: paused.has(q.id),
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
  const day = (id: string) => ({ id, prompt: BOOK_BY_ID.get(id)?.prompt ?? id });
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
    totals: { book: items.length, live: live.length, retired: items.filter((i) => i.retired).length, paused: paused.size, unseen, daysLeft: Math.floor(unseen / 7) },
    byCategory: count((i) => i.category),
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

/** Finds players by the start of their id or a part of their name; also lists the muted ones. */
export async function adminFindPlayers(db: Db, q: string) {
  const needle = q.trim().slice(0, 40);
  const found =
    needle.length >= 2
      ? await db.query<{ player_id: string; name: string | null; runs: number; last_day: string; best: number; muted: boolean }>(
          `select r.player_id, max(r.name) as name, count(*)::int as runs, max(r.day)::text as last_day, max(r.score)::int as best,
                  exists (select 1 from muted m where m.player_id = r.player_id) as muted
           from runs r where starts_with(r.player_id, $1) or strpos(lower(r.name), lower($1)) > 0
           group by r.player_id order by max(r.day) desc limit 20`,
          [needle],
        )
      : [];
  const muted = await db.query<{ player_id: string; at: string }>(`select player_id, at::text as at from muted order by at desc limit 50`);
  return { found, muted };
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
  const base = BOOK_BY_ID.get(id);
  if (!base) throw new GameError(404, 'Không tìm thấy câu hỏi.');
  const q = await loadQuestion(db, id);
  const answers = [...q.answers.entries()]
    .filter(([, e]) => !(e.status === 'pending' && e.source === 'crowd'))
    .map(([key, e]) => ({ key, display: e.display, tier: key === q.krillKey ? 5 : e.prior, source: e.source ?? 'seed', status: e.status }))
    .sort((a, b) => b.tier - a.tier || a.display.localeCompare(b.display, 'vi'));
  return { id, category: q.category, prompt: q.prompt, note: q.note ?? '', bookPrompt: base.prompt, bookNote: base.note ?? '', krillKey: q.krillKey, answers };
}

/** Changes the words of a prompt or its note. Scoring and counts are untouched. */
export async function adminEditQuestion(db: Db, id: string, prompt: unknown, note: unknown) {
  if (!BOOK_BY_ID.has(id)) throw new GameError(404, 'Không tìm thấy câu hỏi.');
  const p = text(prompt, 200);
  if (p.length < 8) throw new GameError(400, 'Câu hỏi quá ngắn.');
  const n = text(note, 300);
  await db.query(
    `insert into question_edits (question_id, prompt, note) values ($1,$2,$3)
     on conflict (question_id) do update set prompt=excluded.prompt, note=excluded.note, updated_at=now()`,
    [id, p, n],
  );
  await db.query(`update questions set prompt=$2, note=nullif($3, '') where id=$1`, [id, p, n]);
  forgetQuestion(id);
  return { ok: true };
}

/** Goes back to the book's own words. */
export async function adminResetQuestion(db: Db, id: string) {
  const base = BOOK_BY_ID.get(id);
  if (!base) throw new GameError(404, 'Không tìm thấy câu hỏi.');
  await db.query(`delete from question_edits where question_id=$1`, [id]);
  await db.query(`update questions set prompt=$2, note=nullif($3, '') where id=$1`, [id, base.prompt, base.note ?? '']);
  forgetQuestion(id);
  return { ok: true };
}

/** Renames an answer, moves it to another tier, or takes it out. The key stays, so its counts and history stay with it. */
export async function adminEditAnswer(db: Db, a: { questionId: string; key: string; display?: unknown; tier?: unknown; remove?: boolean }) {
  const q = await loadQuestion(db, a.questionId);
  const cur = q.answers.get(a.key);
  if (!cur) throw new GameError(404, 'Không tìm thấy đáp án này.');
  const isKrill = a.key === q.krillKey;
  if (a.remove) {
    if (isKrill) throw new GameError(400, 'Đây là đáp án làng giấu của câu này: đổi trong mã, không gỡ ở đây.');
    await db.query(
      `insert into answers (question_id, key, display, prior_tier, source, status) values ($1,$2,$3,$4,'admin','rejected')
       on conflict (question_id, key) do update set status='rejected'`,
      [a.questionId, a.key, cur.display, cur.prior],
    );
  } else {
    const display = a.display === undefined ? cur.display : text(a.display, 60);
    if (!display) throw new GameError(400, 'Tên đáp án trống.');
    const tier = a.tier === undefined || isKrill ? cur.prior : tierOf(a.tier);
    await db.query(
      `insert into answers (question_id, key, display, prior_tier, source, status) values ($1,$2,$3,$4,'admin','approved')
       on conflict (question_id, key) do update set display=excluded.display, prior_tier=excluded.prior_tier, source='admin', status='approved'`,
      [a.questionId, a.key, display, tier],
    );
    // Whoever types the new name finds it, and the old one still works.
    await db.query(`insert into aliases (question_id, alias, key) values ($1,$2,$3) on conflict (question_id, alias) do update set key=excluded.key`, [a.questionId, soft(display), a.key]);
  }
  forgetQuestion(a.questionId);
  return { ok: true };
}

/** Adds an answer the book lacks, with the names people also use for it. */
export async function adminAddAnswer(db: Db, a: { questionId: string; display: unknown; tier: unknown; aliases?: unknown }) {
  const q = await loadQuestion(db, a.questionId);
  const display = text(a.display, 60);
  if (!display) throw new GameError(400, 'Tên đáp án trống.');
  const tier = tierOf(a.tier);
  const found = q.matcher.match(display);
  if (found?.exact || q.answers.has(soft(display))) throw new GameError(409, 'Đáp án này đã có trong sổ.');
  const key = soft(display);
  await db.query(
    `insert into answers (question_id, key, display, prior_tier, source, status) values ($1,$2,$3,$4,'admin','approved')
     on conflict (question_id, key) do update set display=excluded.display, prior_tier=excluded.prior_tier, source='admin', status='approved'`,
    [a.questionId, key, display, tier],
  );
  const names = String(a.aliases ?? '')
    .split(/[,|]/)
    .map((x) => text(x, 60))
    .filter(Boolean)
    .slice(0, 10);
  for (const n of [display, ...names]) {
    await db.query(`insert into aliases (question_id, alias, key) values ($1,$2,$3) on conflict (question_id, alias) do update set key=excluded.key`, [a.questionId, soft(n), key]);
  }
  forgetQuestion(a.questionId);
  return { ok: true };
}

/** Every change made from the admin page, to fold back into the release files so the book in code matches. */
export async function adminEdits(db: Db) {
  const prompts = await db.query<{ question_id: string; prompt: string; note: string | null; updated_at: string }>(
    `select question_id, prompt, note, updated_at::text as updated_at from question_edits order by updated_at desc`,
  );
  const answers = await db.query<{ question_id: string; key: string; display: string; prior_tier: number; status: string }>(
    `select question_id, key, display, prior_tier, status from answers where source='admin' order by question_id, status, display`,
  );
  return {
    prompts: prompts.map((p) => ({ ...p, bookPrompt: BOOK_BY_ID.get(p.question_id)?.prompt ?? '' })),
    answers: answers.map((x) => ({ ...x, inBook: !!BOOK_BY_ID.get(x.question_id)?.answers.some((b) => b.key === x.key) })),
  };
}
