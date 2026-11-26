import { BUILDINGS, MAX_LEVEL, SHIPS, buildingCost, canAfford, countShips, rng, startBuilding, startCollectors, startShips, suggestSpots, COLLECTOR, type BuildingId, type EconomyState, type Job, type NewJob } from '@aquata/rules';
import type { Db } from './db/index.ts';
import type { Round } from './round.ts';
import { insertJob, startValues, withStation } from './economy.ts';
import { sendFleet } from './fleets.ts';

const NAMES = ['Kelpwerk', 'Schlotfeld', 'Perlbank', 'Tangriff', 'Ankerplatz', 'Grauzone', 'Muschelbruch', 'Salzkuppe', 'Driftholz', 'Lotsenstation', 'Quallengrund', 'Rostbucht'];

/**
 * Was ein Bot in diesem Tick tut. Einfach und vorhersehbar:
 * Gebäude reihum ausbauen (Werft zuerst bis 3), Sammler nachkaufen, mit dem Rest Schiffe bauen.
 * Ein Teil der Rohstoffe bleibt immer liegen, damit Angreifer auch etwas zu holen haben.
 */
export function botDecide(s: EconomyState, open: Job[], seed: number): { state: EconomyState; jobs: NewJob[] } {
  const rand = rng(seed);
  const jobs: NewJob[] = [];
  let state = s;
  const reserve = 0.3;
  const spendable = () => ({ alu: state.res.alu * (1 - reserve), stahl: state.res.stahl * (1 - reserve), pu: state.res.pu * (1 - reserve) });

  if (!open.some((j) => j.kind === 'building')) {
    const ids = Object.keys(BUILDINGS) as BuildingId[];
    const pick = state.buildings.werft < 3 ? 'werft' : ids.filter((id) => state.buildings[id] < MAX_LEVEL).sort((a, b) => state.buildings[a] - state.buildings[b])[0];
    if (pick && canAfford(spendable(), buildingCost(pick, state.buildings[pick] + 1).cost)) {
      const r = startBuilding(state, open, pick, Date.now());
      if (!('error' in r)) { state = r.state; jobs.push(r.job); }
    }
  }

  const levels = Object.values(state.buildings).reduce((a, b) => a + b, 0);
  if (!open.some((j) => j.kind === 'collector') && state.collectors < 10 + 4 * levels) {
    const sp = spendable();
    const n = Math.min(5, Math.floor(Math.min(sp.alu / COLLECTOR.cost.alu, COLLECTOR.cost.stahl ? sp.stahl / COLLECTOR.cost.stahl : Infinity)));
    if (n >= 1) {
      const r = startCollectors(state, open, n, Date.now());
      if (!('error' in r)) { state = r.state; jobs.push(r.job); }
    }
  }

  if (open.filter((j) => j.kind === 'ship').length < 2) {
    const types = Object.values(SHIPS).filter((t) => state.buildings.werft >= t.werft);
    const weights = types.map((t) => (t.role === 'erstschlag' ? 2 : 1));
    let x = rand() * weights.reduce((a, b) => a + b, 0);
    const t = types.find((_, i) => (x -= weights[i]!) < 0) ?? types[0];
    if (t) {
      const sp = spendable();
      const per = (r: 'alu' | 'stahl' | 'pu') => (t.cost[r] > 0 ? (sp[r] * 0.5) / t.cost[r] : Infinity);
      const n = Math.min(20, Math.floor(Math.min(per('alu'), per('stahl'), per('pu'))));
      if (n >= 1) {
        const r = startShips(state, open, t.id, n, Date.now());
        if (!('error' in r)) { state = r.state; jobs.push(r.job); }
      }
    }
  }
  return { state, jobs };
}

/** Legt fehlende Bot-Stationen an, bis count erreicht ist */
export async function ensureBots(db: Db, round: Round, count: number) {
  if (count <= 0) return 0;
  const { rows } = await db.query<{ x: number; y: number; is_bot: boolean; station_name: string }>('select x, y, is_bot, station_name from players where round_id = $1', [round.id]);
  const have = rows.filter((r) => r.is_bot).length;
  const others = rows.map((r) => ({ x: r.x, y: r.y }));
  const used = new Set(rows.map((r) => r.station_name));
  let made = 0;
  for (let i = have; i < count; i++) {
    const [p] = suggestSpots(others, 1, round.id * 104729 + i * 31 + 7);
    if (!p) break;
    const name = NAMES.find((n) => !used.has(n)) ?? `Bot ${i + 1}`;
    used.add(name); others.push(p);
    const sv = startValues(Date.now());
    await db.query(
      `insert into players (round_id, account_id, is_bot, station_name, x, y, res_alu, res_stahl, res_pu, res_at, collectors, split, buildings, ships)
       values ($1, null, true, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [round.id, name, p.x, p.y, sv.res_alu, sv.res_stahl, sv.res_pu, sv.res_at, sv.collectors, sv.split, sv.buildings, JSON.stringify({ piranha: 6 + (i % 5) })],
    );
    made++;
  }
  return made;
}

/** Ein Bot-Zug pro Tick: wirtschaften und bauen; mit attacks auch ab und zu einen Spieler angreifen */
export async function runBots(db: Db, round: Round, tick: number, attacks: boolean) {
  const bots = (await db.query<{ id: number; x: number; y: number }>('select id, x, y from players where round_id = $1 and is_bot order by id', [round.id])).rows;
  for (const b of bots) {
    await withStation<null>(db, b.id, async (s, open, _now, q, pid) => {
      const { state, jobs } = botDecide(s, open, round.id * 7_368_787 + tick * 131 + b.id);
      for (const j of jobs) await insertJob(q, pid, j);
      return { state, result: null };
    });
    if (!attacks) continue;
    const r = rng(round.id * 31 + tick * 17 + b.id)();
    if (r > 1 / 30) continue; // selten, damit Tests nicht im Dauerangriff enden
    const { rows } = await db.query<{ ships: Record<string, number> }>('select ships from players where id = $1', [b.id]);
    const home = rows[0]?.ships ?? {};
    if (countShips(home) < 12) continue;
    const targets = (await db.query<{ id: number; x: number; y: number }>('select id, x, y from players where round_id = $1 and not is_bot', [round.id])).rows
      .sort((p, o) => Math.hypot(p.x - b.x, p.y - b.y) - Math.hypot(o.x - b.x, o.y - b.y));
    const target = targets[0];
    if (!target) continue;
    const half = Object.fromEntries(Object.entries(home).map(([id, n]) => [id, Math.floor(n / 2)]).filter(([, n]) => (n as number) > 0));
    await sendFleet(db, round, b.id, { target: target.id, ships: half, fightTicks: 1, mission: 'attack' });
  }
}
