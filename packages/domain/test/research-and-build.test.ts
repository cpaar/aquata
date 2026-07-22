import { describe, expect, it } from "vitest";

import {
  advanceBuildQueue,
  advanceResearch,
  canStartBuild,
  canStartResearch,
  isUnlocked,
  startBuildOrder,
  startResearch,
  type BuildQueueState,
  type ResearchState,
} from "../src/index.js";

describe("research and unlocks", () => {
  it("requires resources and prerequisites before research can start", () => {
    const state: ResearchState = { completed: [] };
    const resources = { aluminium: 1_000, energy: 1_000, steel: 1_000 };

    expect(canStartResearch(state, "frigateEngineering", resources)).toBe(false);
    expect(canStartResearch(state, "shipbuilding", resources)).toBe(true);
    expect(canStartResearch(state, "shipbuilding", { aluminium: 1, energy: 1, steel: 1 })).toBe(
      false,
    );
  });

  it("starts, advances, completes, and exposes Phase 4 ship unlocks", () => {
    const started = startResearch({ completed: [] }, "shipbuilding", {
      aluminium: 1_000,
      energy: 1_000,
      steel: 1_000,
    });

    expect(started.resources).toEqual({ aluminium: 900, energy: 960, steel: 920 });
    expect(started.state.active).toEqual({ definitionId: "shipbuilding", remainingTicks: 2 });

    const afterOneTick = advanceResearch(started.state);
    expect(afterOneTick.active).toEqual({ definitionId: "shipbuilding", remainingTicks: 1 });

    const completed = advanceResearch(afterOneTick);
    expect(completed).toEqual({ completed: ["shipbuilding"] });
    expect(isUnlocked(completed, { kind: "none" }, { kind: "ship", shipTypeId: "piranha" })).toBe(
      true,
    );
    expect(isUnlocked(completed, { kind: "none" }, { kind: "ship", shipTypeId: "taifun" })).toBe(
      false,
    );
  });
});

describe("FIFO build queue", () => {
  it("charges costs and appends build orders", () => {
    const queue: BuildQueueState = { orders: [] };
    const resources = { aluminium: 500, energy: 500, steel: 500 };

    expect(canStartBuild(resources, "piranha", 2)).toBe(true);

    const result = startBuildOrder(queue, resources, {
      buildableId: "piranha",
      id: "build-1",
      quantity: 2,
    });

    expect(result.resources).toEqual({ aluminium: 350, energy: 500, steel: 500 });
    expect(result.queue.orders).toEqual([
      { buildableId: "piranha", id: "build-1", quantity: 2, remainingTicks: 2 },
    ]);
  });

  it("advances only the first order until it completes", () => {
    const queue: BuildQueueState = {
      orders: [
        { buildableId: "hai", id: "build-1", quantity: 1, remainingTicks: 3 },
        { buildableId: "qualle", id: "build-2", quantity: 1, remainingTicks: 1 },
      ],
    };

    const afterOneTick = advanceBuildQueue(queue);
    expect(afterOneTick.completed).toEqual([]);
    expect(afterOneTick.queue.orders[0]).toEqual({
      buildableId: "hai",
      id: "build-1",
      quantity: 1,
      remainingTicks: 2,
    });

    const afterThirdTick = advanceBuildQueue(afterOneTick.queue, 2);
    expect(afterThirdTick.completed[0]).toMatchObject({ orderId: "build-1" });
    expect(afterThirdTick.completed[0]?.output.hai).toBe(1);
    expect(afterThirdTick.queue.orders).toEqual([
      { buildableId: "qualle", id: "build-2", quantity: 1, remainingTicks: 1 },
    ]);
  });

  it("uses leftover ticks for following FIFO orders", () => {
    const result = advanceBuildQueue(
      {
        orders: [
          { buildableId: "piranha", id: "build-1", quantity: 1, remainingTicks: 1 },
          { buildableId: "qualle", id: "build-2", quantity: 1, remainingTicks: 1 },
        ],
      },
      2,
    );

    expect(result.completed.map((completed) => completed.orderId)).toEqual(["build-1", "build-2"]);
    expect(result.completed[0]?.output.piranha).toBe(1);
    expect(result.completed[1]?.output.qualle).toBe(1);
    expect(result.queue.orders).toEqual([]);
  });
});
