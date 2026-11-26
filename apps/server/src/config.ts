import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const num = (v: string | undefined, d: number) => (v && !Number.isNaN(Number(v)) ? Number(v) : d);

export interface Config {
  port: number;
  host: string;
  /** postgres://… für echtes Postgres (Dokku). Leer = PGlite im Datenordner. */
  databaseUrl: string | undefined;
  /** Ordner für PGlite, oder "memory://" für Tests */
  dataDir: string;
  /** Tick-Länge in Sekunden. 3600 = jede volle Stunde, im Test z. B. 120. */
  tickSeconds: number;
  webDist: string;
  /** Cookies nur über HTTPS (auf Dokku hinter TLS: 1) */
  secureCookies: boolean;
}

export function loadConfig(env = process.env): Config {
  return {
    port: num(env.PORT, 3101),
    host: env.HOST ?? '127.0.0.1',
    databaseUrl: env.DATABASE_URL || undefined,
    dataDir: env.DATA_DIR ?? path.resolve(here, '../../../data/pglite'),
    tickSeconds: num(env.TICK_SECONDS, 3600),
    webDist: env.WEB_DIST ?? path.resolve(here, '../../web/dist'),
    secureCookies: env.SECURE_COOKIES === '1',
  };
}
