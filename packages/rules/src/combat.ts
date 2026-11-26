import { DEBRIS, SHIPS, type Cost, type ShipRole } from './data.ts';
import { rng } from './map.ts';

/** Schiffe nach Typ */
export type Ships = Record<string, number>;

export interface Participant { id: number; ships: Ships }
export interface ParticipantResult { id: number; before: Ships; after: Ships; lost: Ships; debris: Cost }

export type Phase = 'emp' | 'erstschlag' | 'normal';
export interface SideLog { active: Ships; paralyzed: Ships; lost: Ships }
export interface PhaseLog { phase: Phase; attacker: SideLog; defender: SideLog }

export interface FightResult {
  attackers: ParticipantResult[];
  defenders: ParticipantResult[];
  phases: PhaseLog[];
  /** attacker: Verteidigung ist weg, Angreifer hat noch Schiffe. defender: Angreifer ist weg. draw: beide haben noch Schiffe. */
  winner: 'attacker' | 'defender' | 'draw';
}

const ORDER = Object.keys(SHIPS);
const PHASE_ROLE: Record<Phase, ShipRole> = { emp: 'emp', erstschlag: 'erstschlag', normal: 'normal' };

export const countShips = (s: Ships) => Object.values(s).reduce((a, n) => a + n, 0);
export const addShips = (a: Ships, b: Ships, sign = 1): Ships => {
  const out: Ships = { ...a };
  for (const [id, n] of Object.entries(b)) out[id] = (out[id] ?? 0) + sign * n;
  for (const id of Object.keys(out)) if (out[id] === 0) delete out[id];
  return out;
};
export function shipsValue(s: Ships): Cost {
  const v: Cost = { alu: 0, stahl: 0, pu: 0 };
  for (const [id, n] of Object.entries(s)) {
    const c = SHIPS[id]?.cost;
    if (!c) continue;
    v.alu += c.alu * n; v.stahl += c.stahl * n; v.pu += c.pu * n;
  }
  return v;
}
const worth = (c: Cost) => c.alu + c.stahl + c.pu;

function total(ps: Participant[]): Ships {
  return ps.reduce<Ships>((acc, p) => addShips(acc, p.ships), {});
}

/** Ganzzahlig runden: Nachkommaanteil entscheidet als Wahrscheinlichkeit (mit festem Seed reproduzierbar) */
const stochRound = (x: number, rand: () => number) => Math.floor(x) + (rand() < x - Math.floor(x) ? 1 : 0);

/**
 * Eine Seite feuert auf die andere. Jeder Schiffstyp arbeitet seine Zielreihenfolge ab:
 * Erst wird die erste Zielklasse vollständig zerstört (bzw. gelähmt), der Rest geht an die nächste.
 * Gibt zurück, wie viele Schiffe je Typ getroffen wurden.
 */
function fire(shooters: Ships, targets: Ships, rand: () => number): Ships {
  const left: Ships = { ...targets };
  const hits: Ships = {};
  for (const sid of ORDER) {
    const n = shooters[sid] ?? 0;
    const s = SHIPS[sid]!;
    if (n <= 0 || s.power <= 0) continue;
    let pool = n * s.power;
    for (const cls of s.targets) {
      for (const tid of ORDER) {
        const t = SHIPS[tid]!;
        if (t.class !== cls || !(left[tid]! > 0) || pool <= 0) continue;
        const hit = s.hit[cls];
        if (hit <= 0) continue;
        const exact = (pool * hit) / t.hp;
        if (exact >= left[tid]!) {
          pool -= (left[tid]! * t.hp) / hit;
          hits[tid] = (hits[tid] ?? 0) + left[tid]!;
          left[tid] = 0;
        } else {
          const k = stochRound(exact, rand);
          hits[tid] = (hits[tid] ?? 0) + k;
          left[tid]! -= k;
          pool = 0;
        }
      }
    }
  }
  return hits;
}

const pick = (s: Ships, role: ShipRole): Ships => Object.fromEntries(Object.entries(s).filter(([id, n]) => n > 0 && SHIPS[id]?.role === role));
const minus = (a: Ships, b: Ships): Ships => Object.fromEntries(Object.entries(a).map(([id, n]) => [id, Math.max(0, n - (b[id] ?? 0))]).filter(([, n]) => (n as number) > 0));

/** Verluste einer Seite nach Anteil auf die Teilnehmer verteilen (größter Rest, stabil nach Reihenfolge) */
function distribute(ps: Participant[], lost: Ships): Ships[] {
  const out = ps.map(() => ({}) as Ships);
  for (const [id, k] of Object.entries(lost)) {
    const have = ps.map((p) => p.ships[id] ?? 0);
    const sum = have.reduce((a, b) => a + b, 0);
    if (!sum || !k) continue;
    const exact = have.map((h) => (h / sum) * k);
    const base = exact.map(Math.floor);
    let rest = k - base.reduce((a, b) => a + b, 0);
    const order = exact.map((e, i) => ({ i, r: e - Math.floor(e) })).sort((a, b) => b.r - a.r || a.i - b.i);
    for (const { i } of order) { if (rest <= 0) break; if (base[i]! < have[i]!) { base[i]!++; rest--; } }
    base.forEach((b, i) => { if (b) out[i]![id] = b; });
  }
  return out;
}

/**
 * Ein Kampftick an einem Ort. Phasen: EMP lähmt, dann schießt Erstschlag, dann der Rest.
 * Beide Seiten handeln in jeder Phase gleichzeitig. Mit gleichem Seed kommt immer dasselbe heraus.
 */
export function fight(attackers: Participant[], defenders: Participant[], seed: number): FightResult {
  const rand = rng(seed);
  let a = total(attackers), d = total(defenders);
  const startA = a, startD = d;
  const phases: PhaseLog[] = [];
  let parA: Ships = {}, parD: Ships = {};

  if (countShips(a) > 0 && countShips(d) > 0) {
    for (const phase of ['emp', 'erstschlag', 'normal'] as Phase[]) {
      const role = PHASE_ROLE[phase];
      const actA = minus(pick(a, role), parA), actD = minus(pick(d, role), parD);
      if (phase === 'emp') {
        parD = fire(actA, d, rand);
        parA = fire(actD, a, rand);
        phases.push({ phase, attacker: { active: actA, paralyzed: parA, lost: {} }, defender: { active: actD, paralyzed: parD, lost: {} } });
      } else {
        const lostD = fire(actA, d, rand), lostA = fire(actD, a, rand);
        a = minus(a, lostA); d = minus(d, lostD);
        // Gelähmte können auch getroffen werden: Lähmung nie über den Bestand hinaus
        parA = Object.fromEntries(Object.entries(parA).map(([id, n]) => [id, Math.min(n, a[id] ?? 0)]));
        parD = Object.fromEntries(Object.entries(parD).map(([id, n]) => [id, Math.min(n, d[id] ?? 0)]));
        phases.push({ phase, attacker: { active: actA, paralyzed: {}, lost: lostA }, defender: { active: actD, paralyzed: {}, lost: lostD } });
      }
    }
  }

  const lostA = minus(startA, a), lostD = minus(startD, d);

  /** Müll: eigener Anteil an den eigenen Verlusten plus Anteil (nach Flottenwert auf der eigenen Seite) an den gegnerischen */
  const results = (ps: Participant[], lost: Ships, enemyLost: Cost): ParticipantResult[] => {
    const shares = distribute(ps, lost);
    const sideWorth = ps.reduce((s, p) => s + worth(shipsValue(p.ships)), 0);
    return ps.map((p, i) => {
      const myLost = shares[i]!;
      const mine = shipsValue(myLost);
      const share = sideWorth > 0 ? worth(shipsValue(p.ships)) / sideWorth : 0;
      const debris: Cost = {
        alu: Math.floor(mine.alu * DEBRIS.own + enemyLost.alu * DEBRIS.enemy * share),
        stahl: Math.floor(mine.stahl * DEBRIS.own + enemyLost.stahl * DEBRIS.enemy * share),
        pu: 0,
      };
      return { id: p.id, before: { ...p.ships }, after: minus(p.ships, myLost), lost: myLost, debris };
    });
  };

  const winner = countShips(a) === 0 ? 'defender' : countShips(d) === 0 ? 'attacker' : 'draw';
  return {
    attackers: results(attackers, lostA, shipsValue(lostD)),
    defenders: results(defenders, lostD, shipsValue(lostA)),
    phases,
    winner,
  };
}
