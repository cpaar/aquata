import pg from "pg";

const databaseUrl = process.env.DATABASE_URL ?? "postgres://aquata:aquata@localhost:55432/aquata";
const timeoutMs = Number(process.env.DB_WAIT_TIMEOUT_MS ?? 30_000);
const intervalMs = Number(process.env.DB_WAIT_INTERVAL_MS ?? 500);
const startedAt = Date.now();

while (Date.now() - startedAt < timeoutMs) {
  const pool = new pg.Pool({ connectionString: databaseUrl });
  try {
    await pool.query("select 1");
    await pool.end();
    console.log("Database is reachable");
    process.exit(0);
  } catch (error) {
    await pool.end().catch(() => undefined);
    if (Date.now() - startedAt + intervalMs >= timeoutMs) {
      const message = error instanceof Error ? error.message : "unknown error";
      console.error(`Database did not become reachable: ${message}`);
      process.exit(1);
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
}

console.error("Database did not become reachable before timeout");
process.exit(1);
