/**
 * Alle Spielzahlen an einem Ort. Platzhalterwerte für v0.1:
 * Sie werden in Testläufen gestimmt, nicht im Code verstreut.
 */

export const RESOURCES = ['alu', 'stahl', 'pu'] as const;
export type Resource = (typeof RESOURCES)[number];
export type Cost = Record<Resource, number>;

export type ShipClass = 'klein' | 'mittel' | 'fregatte' | 'schwer';
export type ShipRole = 'normal' | 'emp' | 'erstschlag';

export interface ShipType {
  id: string;
  name: string;
  class: ShipClass;
  role: ShipRole;
  cost: Cost;
  /** Bauzeit in Sekunden pro Auftrag, egal wie viele Schiffe (wie im alten Spiel) */
  buildSeconds: number;
  /** Werft-Stufe, ab der das Schiff baubar ist */
  werft: number;
  /** Strukturpunkte pro Schiff */
  hp: number;
  /** Schaden pro Schiff und Kampftick (EMP-Schiffe: lähmbare Strukturpunkte) */
  power: number;
  /** Feste Zielreihenfolge nach Klassen: wen das Schiff zuerst angreift */
  targets: ShipClass[];
  /** Trefferchance gegen jede Klasse */
  hit: Record<ShipClass, number>;
}

export const SHIPS: Record<string, ShipType> = {
  piranha: {
    id: 'piranha', name: 'Piranha', class: 'klein', role: 'erstschlag', cost: { alu: 1500, stahl: 0, pu: 0 }, buildSeconds: 120, werft: 1,
    hp: 100, power: 45, targets: ['klein', 'mittel', 'fregatte', 'schwer'], hit: { klein: 0.7, mittel: 0.55, fregatte: 0.3, schwer: 0.15 },
  },
  squid: {
    id: 'squid', name: 'Squid', class: 'klein', role: 'emp', cost: { alu: 0, stahl: 1500, pu: 0 }, buildSeconds: 120, werft: 2,
    hp: 90, power: 160, targets: ['klein', 'mittel', 'fregatte', 'schwer'], hit: { klein: 0.8, mittel: 0.6, fregatte: 0.35, schwer: 0.1 },
  },
  mako: {
    id: 'mako', name: 'Mako', class: 'mittel', role: 'normal', cost: { alu: 2500, stahl: 2000, pu: 0 }, buildSeconds: 300, werft: 3,
    hp: 420, power: 150, targets: ['mittel', 'klein', 'fregatte', 'schwer'], hit: { klein: 0.5, mittel: 0.7, fregatte: 0.6, schwer: 0.35 },
  },
};

/** Zusätzliche Flug-Ticks je Schiffsklasse (entschieden: klein/mittel +0, Fregatte +1, schwer +2) */
export const CLASS_EXTRA_TICKS: Record<ShipClass, number> = { klein: 0, mittel: 0, fregatte: 1, schwer: 2 };

export const BUILDINGS = {
  werft: { id: 'werft', name: 'Werft', baseCost: { alu: 2000, stahl: 1000, pu: 0 }, baseSeconds: 300 },
  antrieb: { id: 'antrieb', name: 'Antriebslabor', baseCost: { alu: 1500, stahl: 1500, pu: 300 }, baseSeconds: 360 },
  sonar: { id: 'sonar', name: 'Sonar', baseCost: { alu: 1000, stahl: 800, pu: 500 }, baseSeconds: 300 },
} as const;
export type BuildingId = keyof typeof BUILDINGS;

/** Kosten- und Zeitsteigerung pro Stufe */
export const LEVEL_GROWTH = { cost: 1.6, time: 1.5 };

/** Ertrag eines Sammlers pro Stunde (= pro Tick im alten Spiel), je nach Ressource */
export const COLLECTOR_YIELD_PER_HOUR: Cost = { alu: 250, stahl: 250, pu: 250 };
/** Grundertrag jeder Station pro Stunde, unabhängig von Sammlern (wie im alten Spiel) */
export const BASE_INCOME_PER_HOUR: Cost = { alu: 750, stahl: 750, pu: 750 };

/** Flugzeit: Basis-Ticks nur mit voll ausgebautem Antrieb, logarithmisch mit der Entfernung */
export const FLIGHT = { baseTicks: 4, maxPenaltyTicks: 4, distanceScale: 40, drivePenaltyTicks: 3, maxDriveLevel: 10 };

/** Startwerte für neue Stationen */
export const START = {
  resources: { alu: 10000, stahl: 10000, pu: 2000 } as Cost,
  collectors: 10,
  split: { alu: 60, stahl: 30, pu: 10 },
  buildings: { werft: 1, antrieb: 0, sonar: 1 } as Record<'werft' | 'antrieb' | 'sonar', number>,
};

/**
 * Sammler wie im alten Spiel: der n-te Sammler kostet base + step · n, je in Alu UND Stahl.
 * n zählt alle Sammler, auch die im Bau. Jeder Auftrag dauert buildTicks Ticks, egal wie viele.
 */
export const COLLECTOR = { base: 850, step: 112, buildTicks: 4 };

/** Höchstmenge pro Bauauftrag (nur gegen Tippfehler) */
export const MAX_ORDER = 100_000;

/** Höchststufe je Gebäude im Prototyp */
export const MAX_LEVEL = 10;

/** Treibstoff: Plutonium pro Schiff und Flug-Tick, Hin- und Rückflug werden beim Start bezahlt */
export const FUEL_PER_TICK: Record<ShipClass, number> = { klein: 2, mittel: 5, fregatte: 10, schwer: 20 };
/** Jede Antriebsstufe spart so viel Treibstoff (Anteil) */
export const FUEL_SAVING_PER_DRIVE_LEVEL = 0.04;

/** Sonar-Reichweite in Kartenpunkten: Grundwert plus pro Stufe */
export const SONAR = { base: 80, perLevel: 50 };
/** Spätestens so viele Ticks vor Ankunft wird das Ziel gewarnt (Mindestwarnzeit) */
export const MIN_WARNING_TICKS = 3;

/** Angriff: wie viele Kampfticks höchstens, wie viele Ticks man die Ankunft höchstens verzögern kann */
export const ATTACK = { maxFightTicks: 3, maxDelayTicks: 12 };
/** Beute je gewonnenem Kampftick: Anteil der Rohstoffe des Ziels */
export const LOOT_SHARE = 0.1;
/** Müll: Anteil der eigenen und der gegnerischen Verluste (nur Alu und Stahl) */
export const DEBRIS = { own: 0.2, enemy: 0.14 };
