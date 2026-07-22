import type { ResourceStock, ShipLoadout } from "../api/types.js";

export const resourceLabels: Record<keyof ResourceStock, string> = {
  aluminium: "Aluminium",
  energy: "Energie",
  steel: "Stahl",
};

export const resourceOrder = ["aluminium", "steel", "energy"] as const;

export const shipOrder = [
  "piranha",
  "qualle",
  "hai",
  "hackboot",
  "taifun",
  "tsunami",
  "blizzard",
  "hurricane",
  "bermuda",
  "kittyHawk",
  "enterprise",
  "atlantis",
  "harvester",
] as const;

export const researchOrder = ["shipbuilding", "frigateEngineering", "industrialLogistics"] as const;

export function formatResources(resources: ResourceStock): string {
  return `${resources.aluminium} Alu / ${resources.steel} Stahl / ${resources.energy} Energie`;
}

export function formatCost(resources: ResourceStock): string {
  const parts = resourceOrder
    .filter((resourceType) => resources[resourceType] > 0)
    .map((resourceType) => `${resources[resourceType]} ${resourceLabels[resourceType]}`);
  return parts.length > 0 ? parts.join(" / ") : "kostenlos";
}

export function formatLoadout(loadout: Partial<ShipLoadout>): string {
  const parts = shipOrder
    .filter((shipType) => (loadout[shipType] ?? 0) > 0)
    .map((shipType) => `${shipType}: ${loadout[shipType]}`);
  return parts.length > 0 ? parts.join(", ") : "keine";
}

export function sumResources(resources: ResourceStock): number {
  return resources.aluminium + resources.energy + resources.steel;
}
