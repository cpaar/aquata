import { tickAt, tickTime } from '@aquata/rules';
import type { Db } from './db/index.ts';

export interface Round { id: number; name: string; startedAt: number; tickSeconds: number; status: string }

/** Holt die laufende Runde oder legt für die Entwicklung eine an, die an einer Tick-Grenze startet */
export async function currentRound(db: Db, tickSeconds: number, now = Date.now()): Promise<Round> {
  const { rows } = await db.query<{ id: number; name: string; started_at: Date | string; tick_seconds: number; status: string }>(
    `select * from rounds where status <> 'ended' order by id desc limit 1`,
  );
  let r = rows[0];
  if (!r) {
    const start = new Date(Math.floor(now / (tickSeconds * 1000)) * tickSeconds * 1000);
    const ins = await db.query<typeof r & object>(
      `insert into rounds (name, started_at, tick_seconds) values ($1, $2, $3) returning *`,
      ['Testrunde 1', start.toISOString(), tickSeconds],
    );
    r = ins.rows[0]!;
  }
  return { id: r.id, name: r.name, startedAt: new Date(r.started_at).getTime(), tickSeconds: r.tick_seconds, status: r.status };
}

export function tickInfo(round: Round, now = Date.now()) {
  const tick = tickAt(round.startedAt, round.tickSeconds, now);
  return { tick, nextTickAt: tickTime(round.startedAt, round.tickSeconds, tick + 1), tickSeconds: round.tickSeconds, now };
}
