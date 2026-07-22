import { describe, expect, it } from "vitest";

import {
  calculateDistance,
  calculateFleetCost,
  calculateFleetPower,
  calculateTravelTicks,
  getShipType,
  isFleetEmpty,
  phase4ShipDefinitionsVersion,
} from "../src/index.js";

describe("2D map and travel time", () => {
  it("calculates straight-line euclidean distance", () => {
    expect(calculateDistance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
  });

  it("uses zero ticks for the same tile", () => {
    expect(calculateTravelTicks({ x: 4, y: 7 }, { x: 4, y: 7 })).toBe(0);
  });

  it("ceil-rounds euclidean distance before applying MVP travel bands", () => {
    expect(calculateTravelTicks({ x: 0, y: 0 }, { x: 7, y: 7 })).toBe(4);
    expect(calculateTravelTicks({ x: 0, y: 0 }, { x: 10, y: 1 })).toBe(5);
    expect(calculateTravelTicks({ x: 0, y: 0 }, { x: 20, y: 1 })).toBe(6);
    expect(calculateTravelTicks({ x: 0, y: 0 }, { x: 31, y: 0 })).toBe(7);
  });

  it("keeps exact band boundaries stable", () => {
    expect(calculateTravelTicks({ x: 0, y: 0 }, { x: 10, y: 0 })).toBe(4);
    expect(calculateTravelTicks({ x: 0, y: 0 }, { x: 20, y: 0 })).toBe(5);
    expect(calculateTravelTicks({ x: 0, y: 0 }, { x: 30, y: 0 })).toBe(6);
  });
});

describe("Phase 4 ship definitions", () => {
  it("exposes versioned legacy ship data with traits", () => {
    expect(phase4ShipDefinitionsVersion).toBe("phase-4-legacy-catalog-2026-06-08");
    expect(getShipType("harvester").class).toBe("economic");
    expect(getShipType("piranha")).toMatchObject({
      cost: { aluminium: 75, energy: 0, steel: 0 },
      displayName: "Piranha",
      legacyId: 1,
      trait: "firstStrike",
    });
    expect(getShipType("qualle").trait).toBe("emp");
    expect(getShipType("hackboot").trait).toBe("hack");
  });

  it("calculates fleet cost and combat power from the legacy catalog", () => {
    expect(calculateFleetCost({ hai: 2, harvester: 1, piranha: 1 })).toEqual({
      aluminium: 345,
      energy: 30,
      steel: 130,
    });
    expect(calculateFleetPower({ hai: 2, piranha: 1 })).toEqual({
      attack: 22.3,
      durability: 31,
    });
  });

  it("detects empty fleets after normalization", () => {
    expect(isFleetEmpty({})).toBe(true);
    expect(isFleetEmpty({ piranha: 1 })).toBe(false);
  });
});
