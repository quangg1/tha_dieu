import { BOOK, RETIRED } from '../shared/book/questions.js';
import { UNTIL } from '../shared/book/release.js';
import type { QuestionDef } from '../shared/match.js';
import type { Db } from './db.js';

/**
 * The question book as the database holds it. The files in shared/book are only where new prompts come in: on each
 * deploy a prompt the database has never seen is added, and one it already has is left alone, so what the village
 * head edits on the admin page is never overwritten by the code. Reads are synchronous from a copy in memory that
 * reloads when the book's revision (a counter in meta) moves.
 */

export type Status = 'active' | 'paused' | 'retired';

interface Row {
  def: QuestionDef;
  status: Status;
  until: string | null;
}

let rows = new Map<string, Row>();
let list: QuestionDef[] = [];
let loadedRev: string | null = null;
let checkedAt = 0;
/** How often an instance asks whether the book changed. */
const CHECK_MS = 5_000;

const REV = `select value from meta where key='book_rev'`;

async function bump(db: Db) {
  await db.query(`insert into meta (key, value) values ('book_rev', '1') on conflict (key) do update set value = (meta.value::int + 1)::text`);
}

async function load(db: Db) {
  const all = await db.query<{ id: string; def: QuestionDef | string; status: string; until: string | null }>(`select id, def, status, until from book order by seq`);
  const next = new Map<string, Row>();
  for (const r of all) next.set(r.id, { def: typeof r.def === 'string' ? JSON.parse(r.def) : r.def, status: r.status as Status, until: r.until });
  rows = next;
  list = [...next.values()].map((r) => r.def);
  const [rev] = await db.query<{ value: string }>(REV);
  loadedRev = rev?.value ?? '0';
}

/** Makes the copy in memory current: a quick check at most every few seconds, a full reload only when the revision moved. */
export async function ensureBook(db: Db, force = false) {
  const now = Date.now();
  if (!force && loadedRev !== null && now - checkedAt < CHECK_MS) return;
  checkedAt = now;
  if (!force && loadedRev !== null) {
    const [rev] = await db.query<{ value: string }>(REV);
    if ((rev?.value ?? '0') === loadedRev) return;
  }
  await load(db);
}

/** The revision this copy was loaded at: a cache built from the book is stale once it moves. */
export const rev = () => loadedRev;
export const all = () => list;
export const get = (id: string) => rows.get(id)?.def;
export const has = (id: string) => rows.has(id);
export const status = (id: string): Status | undefined => rows.get(id)?.status;
export const until = (id: string) => rows.get(id)?.until ?? null;
export const untilMap = () => new Map([...rows].filter(([, r]) => r.until).map(([id, r]) => [id, r.until!] as const));

/** Syncs the questions table (used by joins and the night draw) from the book. */
async function syncQuestions(db: Db, ids?: string[]) {
  await ensureBook(db, true);
  const defs = (ids ?? [...rows.keys()]).map((id) => rows.get(id)).filter((r): r is Row => !!r);
  if (!defs.length) return;
  await db.query(
    `insert into questions (id, category, prompt, note, strip, krill_key, active)
     select id, c, p, nullif(n, ''), string_to_array(st, ' '), k, a = 'y'
     from unnest($1::text[], $2::text[], $3::text[], $4::text[], $5::text[], $6::text[], $7::text[]) as x(id, c, p, n, st, k, a)
     on conflict (id) do update set category=excluded.category, prompt=excluded.prompt, note=excluded.note,
       strip=excluded.strip, krill_key=excluded.krill_key, active=excluded.active`,
    [
      defs.map((r) => r.def.id),
      defs.map((r) => r.def.category),
      defs.map((r) => r.def.prompt),
      defs.map((r) => r.def.note ?? ''),
      defs.map((r) => r.def.strip.join(' ')),
      defs.map((r) => r.def.krillKey),
      // Sent as text: the Postgres driver does not pass a boolean array.
      defs.map((r) => (r.status === 'active' ? 'y' : 'n')),
    ],
  );
  await db.query(`update questions set active=false where not (id = any($1::text[]))`, [[...rows.keys()]]);
}

/** Writes one prompt's definition (and optionally its status or last day), and tells every instance. */
export async function save(db: Db, def: QuestionDef, patch: { status?: Status; until?: string | null } = {}) {
  await ensureBook(db);
  const cur = rows.get(def.id);
  const st = patch.status ?? cur?.status ?? 'active';
  const un = patch.until === undefined ? cur?.until ?? null : patch.until;
  await db.query(
    `insert into book (id, def, status, until) values ($1, $2::jsonb, $3, $4)
     on conflict (id) do update set def=excluded.def, status=excluded.status, until=excluded.until, updated_at=now()`,
    [def.id, JSON.stringify(def), st, un],
  );
  await bump(db);
  await syncQuestions(db, [def.id]);
}

/**
 * Gets the book into the database: a prompt it does not have yet comes from the files; the old pause list and the
 * first admin edits (kept as overrides before the book moved here) are folded into the prompts they belong to.
 */
export async function seedBook(db: Db) {
  const have = new Set((await db.query<{ id: string }>(`select id from book`)).map((r) => r.id));
  const fresh = BOOK.filter((q) => !have.has(q.id));
  let changed = fresh.length > 0;
  for (let i = 0; i < fresh.length; i += 100) {
    const chunk = fresh.slice(i, i + 100);
    await db.query(
      `insert into book (id, def, status, until)
       select id, def::jsonb, status, nullif(until, '') from unnest($1::text[], $2::text[], $3::text[], $4::text[]) as x(id, def, status, until)
       on conflict (id) do nothing`,
      [chunk.map((q) => q.id), chunk.map((q) => JSON.stringify(q)), chunk.map((q) => (RETIRED.has(q.id) ? 'retired' : 'active')), chunk.map((q) => UNTIL.get(q.id) ?? '')],
    );
  }
  // The pause list from before the book moved here.
  const [paused] = await db.query<{ value: string }>(`select value from meta where key='paused'`);
  if (paused) {
    try {
      const ids = (JSON.parse(paused.value) as unknown[]).map(String);
      if (ids.length) await db.query(`update book set status='paused' where id = any($1::text[]) and status='active'`, [ids]);
    } catch {
      /* an unreadable list is dropped */
    }
    await db.query(`delete from meta where key='paused'`);
    changed = true;
  }
  // Edits made while they were overrides: fold them into the prompt, then delete them so they cannot apply twice.
  const edits = await db.query<{ question_id: string; prompt: string; note: string | null }>(`select question_id, prompt, note from question_edits`);
  for (const e of edits) {
    const [row] = await db.query<{ def: QuestionDef | string }>(`select def from book where id=$1`, [e.question_id]);
    if (row) {
      const def: QuestionDef = typeof row.def === 'string' ? JSON.parse(row.def) : row.def;
      def.prompt = e.prompt;
      if (e.note) def.note = e.note;
      else delete def.note;
      await db.query(`update book set def=$2::jsonb, updated_at=now() where id=$1`, [e.question_id, JSON.stringify(def)]);
      changed = true;
    }
    await db.query(`delete from question_edits where question_id=$1`, [e.question_id]);
  }
  const ov = await db.query<{ question_id: string; key: string; display: string; prior_tier: number; status: string }>(
    `select question_id, key, display, prior_tier, status from answers where source='admin'`,
  );
  for (const o of ov) {
    const [row] = await db.query<{ def: QuestionDef | string }>(`select def from book where id=$1`, [o.question_id]);
    if (!row) continue;
    const def: QuestionDef = typeof row.def === 'string' ? JSON.parse(row.def) : row.def;
    const a = def.answers.find((x) => x.key === o.key);
    if (!a) continue; // an answer added from the page, not in the book: it stays an ordinary learned answer
    if (o.status === 'rejected') def.answers = def.answers.filter((x) => x.key !== o.key);
    else {
      a.display = o.display;
      a.priorTier = o.prior_tier;
      if (!a.aliases.includes(o.display)) a.aliases.push(o.display);
    }
    await db.query(`update book set def=$2::jsonb, updated_at=now() where id=$1`, [o.question_id, JSON.stringify(def)]);
    await db.query(`delete from answers where question_id=$1 and key=$2 and source='admin'`, [o.question_id, o.key]);
    changed = true;
  }
  if (changed) await bump(db);
  await syncQuestions(db);
  return { added: fresh.length };
}
