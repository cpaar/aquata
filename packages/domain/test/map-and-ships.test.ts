import { describe, expect, it } from "vitest";

import {
  calculateDistance,
  calculateFleetCost,
  calculateFleetPower,
  calculateTravelTicks,
  getShipType,
  isFleetEmpty,
  mvpShipDefinitionsVersion,
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

describe("MVP ship definitions", () => {
  it("exposes versioned MVP ship data", () => {
    expect(mvpShipDefinitionsVersion).toBe("mvp-2026-06-08");
    expect(getShipType("harvester").class).toBe("economic");
    expect(getShipType("fighter").class).toBe("combat");
  });

  it("calculates fleet cost and combat power from loadouts", () => {
    expect(calculateFleetCost({ fighter: 2, harvester: 1 })).toEqual({
      aluminium: 230,
      energy: 70,
      steel: 110,
    });
    expect(calculateFleetPower({ fighter: 2, harvester: 1 })).toEqual({
      attack: 16,
      durability: 28,
    });
  });

  it("detects empty fleets after normalization", () => {
    expect(isFleetEmpty({})).toBe(true);
    expect(isFleetEmpty({ interceptor: 1 })).toBe(false);
  });
});
