import { BOOK, BOOK_BY_ID, RETIRED } from '../shared/book/questions.js';
import { UNTIL } from '../shared/book/release.js';
import type { Db } from './db.js';
import { DB_VERSION, GameError, dayQuestion, forgetBoard, forgetQuestion, isPop, syncedVersion, vnToday } from './service.js';

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
  const items = BOOK.map((q) => {
    const s = stat.get(q.id);
    return {
      id: q.id,
      prompt: q.prompt,
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
