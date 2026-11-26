import { BUILDINGS, COLLECTOR, SHIPS, START, shipSeconds, startShips, buildingCost, normalizeSplit, productionPerHour, settle, startBuilding, startCollectors, type BuildingId, type EconomyState, type Job, type NewJob, type Split } from '@aquata/rules';
import type { Db, Queryable } from './db/index.ts';

interface Row { res_alu: number; res_stahl: number; res_pu: number; res_at: Date | string; collectors: number; split: Split; buildings: Record<BuildingId, number>; ships: Record<string, number> }
interface JobRow { id: number; kind: 'building' | 'collector' | 'ship'; item: string | null; level: number | null; amount: number | null; started_at: Date | string; finishes_at: Date | string }

const ms = (d: Date | string) => new Date(d).getTime();
const iso = (n: number) => new Date(n).toISOString();

export const startValues = (now: number) => ({
  res_alu: START.resources.alu, res_stahl: START.resources.stahl, res_pu: START.resources.pu, res_at: iso(now),
  collectors: START.collectors, split: JSON.stringify(START.split), buildings: JSON.stringify(START.buildings),
});

async function load(q: Queryable, playerId: number, lock: boolean): Promise<{ state: EconomyState; jobs: Job[] }> {
  const { rows } = await q.query<Row>(`select res_alu, res_stahl, res_pu, res_at, collectors, split, buildings, ships from players where id = $1${lock ? ' for update' : ''}`, [playerId]);
  const r = rows[0];
  if (!r) throw new Error('Spieler nicht gefunden');
  const jobs = (await q.query<JobRow>('select * from jobs where player_id = $1 order by finishes_at', [playerId])).rows.map((j): Job =>
    j.kind === 'building'
      ? { id: j.id, kind: 'building', item: j.item as BuildingId, level: j.level!, startedAt: ms(j.started_at), finishesAt: ms(j.finishes_at) }
      : j.kind === 'ship'
        ? { id: j.id, kind: 'ship', item: j.item!, amount: j.amount!, startedAt: ms(j.started_at), finishesAt: ms(j.finishes_at) }
        : { id: j.id, kind: 'collector', amount: j.amount!, startedAt: ms(j.started_at), finishesAt: ms(j.finishes_at) });
  return { state: { res: { alu: r.res_alu, stahl: r.res_stahl, pu: r.res_pu }, resAt: ms(r.res_at), collectors: r.collectors, split: r.split, buildings: r.buildings, ships: r.ships }, jobs };
}

async function save(q: Queryable, playerId: number, s: EconomyState, done: Job[]) {
  await q.query(
    'update players set res_alu = $2, res_stahl = $3, res_pu = $4, res_at = $5, collectors = $6, split = $7, buildings = $8, ships = $9 where id = $1',
    [playerId, s.res.alu, s.res.stahl, s.res.pu, iso(s.resAt), s.collectors, JSON.stringify(s.split), JSON.stringify(s.buildings), JSON.stringify(s.ships)],
  );
  if (done.length) await q.query('delete from jobs where id = any($1::int[])', [done.map((j) => j.id)]);
}

type StationAct<T> = (s: EconomyState, open: Job[], now: number, q: Queryable, playerId: number) => Promise<{ state: EconomyState; result: T }>;

/** Wie withStation, aber innerhalb einer schon laufenden Transaktion (z. B. im Tick) */
export async function stationIn<T>(q: Queryable, playerId: number, act?: StationAct<T>) {
  const now = Date.now();
  const { state, jobs } = await load(q, playerId, true);
  const settled = settle(state, jobs, now);
  let s = settled.state;
  let result: T | undefined;
  if (act) ({ state: s, result } = await act(s, settled.open, now, q, playerId));
  await save(q, playerId, s, settled.done);
  return { state: s, result };
}

/** Lädt die Station, rechnet sie auf „jetzt“, speichert und führt optional eine Aktion aus – alles in einer Transaktion */
export function withStation<T>(db: Db, playerId: number, act?: StationAct<T>) {
  return db.tx((q) => stationIn(q, playerId, act));
}

export async function insertJob(q: Queryable, playerId: number, job: NewJob) {
  await q.query('insert into jobs (player_id, kind, item, level, amount, started_at, finishes_at) values ($1, $2, $3, $4, $5, $6, $7)', [
    playerId, job.kind, job.kind === 'collector' ? null : job.item, job.kind === 'building' ? job.level : null, job.kind === 'building' ? null : job.amount, iso(job.startedAt), iso(job.finishesAt),
  ]);
}

/** Antwort für den Client: Zustand, Rate, Aufträge und was der nächste Ausbau kostet */
export async function stationView(db: Db, playerId: number) {
  const { state } = await withStation<never>(db, playerId);
  const { jobs } = await load(db, playerId, false);
  return {
    resources: state.res,
    resAt: state.resAt,
    rate: productionPerHour(state.collectors, state.split),
    collectors: state.collectors,
    split: normalizeSplit(state.split),
    buildings: (Object.keys(BUILDINGS) as BuildingId[]).map((id) => ({ id, name: BUILDINGS[id].name, level: state.buildings[id], next: buildingCost(id, state.buildings[id] + 1) })),
    collector: { cost: COLLECTOR.cost, buildTicks: COLLECTOR.buildTicks },
    ships: state.ships,
    shipTypes: Object.values(SHIPS).map((t) => ({ ...t, seconds: shipSeconds(t.id, state.buildings.werft), unlocked: state.buildings.werft >= t.werft })),
    jobs: jobs.map((j) => ({ ...j })),
  };
}

export { startBuilding, startCollectors, startShips };
