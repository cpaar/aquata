import { describe, expect, it } from "vitest";

import { addResources, emptyResources } from "../src/index.js";

describe("resources", () => {
  it("adds resource stocks deterministically", () => {
    expect(
      addResources(emptyResources(), {
        energy: 3,
        heavyMetal: 2,
        lightMetal: 1,
      }),
    ).toEqual({
      energy: 3,
      heavyMetal: 2,
      lightMetal: 1,
    });
  });
});
