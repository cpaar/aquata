import { describe, expect, it } from "vitest";

import { addResources, emptyResources } from "../src/index.js";

describe("resources", () => {
  it("adds resource stocks deterministically", () => {
    expect(
      addResources(emptyResources(), {
        aluminium: 1,
        energy: 3,
        steel: 2,
      }),
    ).toEqual({
      aluminium: 1,
      energy: 3,
      steel: 2,
    });
  });
});
