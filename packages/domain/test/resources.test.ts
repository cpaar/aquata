import { describe, expect, it } from "vitest";

import {
  addResources,
  calculateProduction,
  canAfford,
  clampResources,
  emptyResources,
  multiplyResources,
  subtractResources,
} from "../src/index.js";

describe("resources and production", () => {
  it("adds resource stocks without mutating the input", () => {
    const current = emptyResources();
    const result = addResources(current, { aluminium: 1, energy: 3, steel: 2 });

    expect(result).toEqual({ aluminium: 1, energy: 3, steel: 2 });
    expect(current).toEqual({ aluminium: 0, energy: 0, steel: 0 });
  });

  it("subtracts affordable costs and rejects negative balances", () => {
    const stock = { aluminium: 10, energy: 8, steel: 6 };

    expect(subtractResources(stock, { aluminium: 2, energy: 3, steel: 4 })).toEqual({
      aluminium: 8,
      energy: 5,
      steel: 2,
    });
    expect(canAfford(stock, { aluminium: 11, energy: 1, steel: 1 })).toBe(false);
    expect(() => subtractResources(stock, { aluminium: 11, energy: 1, steel: 1 })).toThrow(
      "Insufficient resources",
    );
  });

  it("multiplies and clamps resource stocks", () => {
    expect(multiplyResources({ aluminium: 2, energy: 1.5, steel: 3 }, 2)).toEqual({
      aluminium: 4,
      energy: 3,
      steel: 6,
    });
    expect(clampResources({ aluminium: -2, energy: 20, steel: 5 })).toEqual({
      aluminium: 0,
      energy: 20,
      steel: 5,
    });
  });

  it("calculates deterministic 30-minute tick production", () => {
    expect(
      calculateProduction([
        { count: 2, id: "aluminium-collector", produces: { aluminium: 6, energy: 0, steel: 0 } },
        { count: 1, id: "reactor", produces: { aluminium: 0, energy: 4, steel: 0 } },
      ]),
    ).toEqual({ aluminium: 12, energy: 4, steel: 0 });
  });
});
