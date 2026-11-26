import { readdir, readFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import type { Config } from '../config.ts';

/** Kleinste gemeinsame Schnittstelle für PGlite (Entwicklung) und Postgres (Dokku) */
export interface Db {
  query<T = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<{ rows: T[] }>;
  exec(sql: string): Promise<void>;
  close(): Promise<void>;
  kind: 'pglite' | 'postgres';
}

export async function openDb(config: Pick<Config, 'databaseUrl' | 'dataDir'>): Promise<Db> {
  if (config.databaseUrl) {
    const { default: pg } = await import('pg');
    const pool = new pg.Pool({ connectionString: config.databaseUrl });
    return {
      kind: 'postgres',
      query: async (sql, params) => ({ rows: (await pool.query(sql, params as unknown[])).rows }),
      exec: async (sql) => void (await pool.query(sql)),
      close: () => pool.end(),
    };
  }
  const { PGlite } = await import('@electric-sql/pglite');
  if (!config.dataDir.startsWith('memory://')) await mkdir(config.dataDir, { recursive: true });
  const db = new PGlite(config.dataDir);
  await db.waitReady;
  return {
    kind: 'pglite',
    query: async (sql, params) => ({ rows: (await db.query(sql, params as unknown[])).rows as never[] }),
    exec: async (sql) => void (await db.exec(sql)),
    close: () => db.close(),
  };
}

const migrationsDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'migrations');

/** Spielt alle noch nicht angewendeten SQL-Dateien aus migrations/ der Reihe nach ein */
export async function migrate(db: Db): Promise<string[]> {
  await db.exec(`create table if not exists schema_migrations (name text primary key, applied_at timestamptz not null default now())`);
  const done = new Set((await db.query<{ name: string }>('select name from schema_migrations')).rows.map((r) => r.name));
  const files = (await readdir(migrationsDir)).filter((f) => f.endsWith('.sql')).sort();
  const applied: string[] = [];
  for (const f of files) {
    if (done.has(f)) continue;
    const sql = await readFile(path.join(migrationsDir, f), 'utf8');
    await db.exec(`begin; ${sql}; insert into schema_migrations (name) values ('${f}'); commit;`);
    applied.push(f);
  }
  return applied;
}
