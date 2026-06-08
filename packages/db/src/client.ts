import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import pg from "pg";

import * as schema from "./schema.js";

export type AquataDb = NodePgDatabase<typeof schema>;

export type DbClient = {
  db: AquataDb;
  pool: pg.Pool;
};

export function createDbClient(databaseUrl: string): DbClient {
  const pool = new pg.Pool({ connectionString: databaseUrl });
  return {
    db: drizzle(pool, { schema }),
    pool,
  };
}

export async function closeDbClient(client: DbClient): Promise<void> {
  await client.pool.end();
}
