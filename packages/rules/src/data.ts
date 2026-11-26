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
  /** Bauzeit in Sekunden pro Schiff */
  buildSeconds: number;
  /** Werft-Stufe, ab der das Schiff baubar ist */
  werft: number;
}

export const SHIPS: Record<string, ShipType> = {
  piranha: { id: 'piranha', name: 'Piranha', class: 'klein', role: 'erstschlag', cost: { alu: 1500, stahl: 0, pu: 0 }, buildSeconds: 120, werft: 1 },
  squid: { id: 'squid', name: 'Squid', class: 'klein', role: 'emp', cost: { alu: 0, stahl: 1500, pu: 0 }, buildSeconds: 120, werft: 2 },
  mako: { id: 'mako', name: 'Mako', class: 'mittel', role: 'normal', cost: { alu: 2500, stahl: 2000, pu: 0 }, buildSeconds: 300, werft: 3 },
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

/** Ertrag eines Sammlers pro Stunde, je nach Ressource */
export const COLLECTOR_YIELD_PER_HOUR: Cost = { alu: 60, stahl: 45, pu: 20 };

/** Flugzeit: Basis-Ticks nur mit voll ausgebautem Antrieb, logarithmisch mit der Entfernung */
export const FLIGHT = { baseTicks: 4, maxPenaltyTicks: 4, distanceScale: 40, drivePenaltyTicks: 3, maxDriveLevel: 10 };
