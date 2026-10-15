import postgres from 'postgres';

/** The small slice of a Postgres client the game needs: parameterized queries returning rows. */
export interface Db {
  query<T = Record<string, unknown>>(text: string, params?: unknown[]): Promise<T[]>;
  exec(text: string): Promise<void>;
}

let shared: Promise<Db> | null = null;

/** One client per server instance. DATABASE_URL may be a Postgres URL, or "pglite:memory" for local development and tests. */
export function getDb(): Promise<Db> {
  if (!shared) shared = connect(process.env.DATABASE_URL || process.env.POSTGRES_URL || '');
  return shared;
}

export async function connect(url: string): Promise<Db> {
  if (!url) throw new Error('DATABASE_URL chưa được cấu hình.');
  if (url.startsWith('pglite')) return pglite();
  const sql = postgres(url, { max: 3, prepare: false, idle_timeout: 20, connect_timeout: 10 });
  return {
    async query<T>(text: string, params: unknown[] = []) {
      return (await sql.unsafe(text, params as never[])) as unknown as T[];
    },
    async exec(text: string) {
      await sql.unsafe(text);
    },
  };
}

export async function pglite(): Promise<Db> {
  const { PGlite } = await import('@electric-sql/pglite');
  const db = new PGlite();
  return {
    async query<T>(text: string, params: unknown[] = []) {
      return (await db.query<T>(text, params)).rows;
    },
    async exec(text: string) {
      await db.exec(text);
    },
  };
}
