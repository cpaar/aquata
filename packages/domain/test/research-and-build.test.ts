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

  it("starts, advances, completes, and exposes unlocks", () => {
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
    expect(isUnlocked(completed, { kind: "none" }, { kind: "ship", shipTypeId: "fighter" })).toBe(
      true,
    );
    expect(isUnlocked(completed, { kind: "none" }, { kind: "ship", shipTypeId: "frigate" })).toBe(
      false,
    );
  });
});

describe("FIFO build queue", () => {
  it("charges costs and appends build orders", () => {
    const queue: BuildQueueState = { orders: [] };
    const resources = { aluminium: 500, energy: 500, steel: 500 };

    expect(canStartBuild(resources, "fighter", 2)).toBe(true);

    const result = startBuildOrder(queue, resources, {
      buildableId: "fighter",
      id: "build-1",
      quantity: 2,
    });

    expect(result.resources).toEqual({ aluminium: 340, energy: 460, steel: 420 });
    expect(result.queue.orders).toEqual([
      { buildableId: "fighter", id: "build-1", quantity: 2, remainingTicks: 4 },
    ]);
  });

  it("advances only the first order until it completes", () => {
    const queue: BuildQueueState = {
      orders: [
        { buildableId: "fighter", id: "build-1", quantity: 1, remainingTicks: 2 },
        { buildableId: "interceptor", id: "build-2", quantity: 1, remainingTicks: 1 },
      ],
    };

    const afterOneTick = advanceBuildQueue(queue);
    expect(afterOneTick.completed).toEqual([]);
    expect(afterOneTick.queue.orders[0]).toEqual({
      buildableId: "fighter",
      id: "build-1",
      quantity: 1,
      remainingTicks: 1,
    });

    const afterSecondTick = advanceBuildQueue(afterOneTick.queue);
    expect(afterSecondTick.completed).toEqual([
      { orderId: "build-1", output: { fighter: 1, frigate: 0, harvester: 0, interceptor: 0 } },
    ]);
    expect(afterSecondTick.queue.orders).toEqual([
      { buildableId: "interceptor", id: "build-2", quantity: 1, remainingTicks: 1 },
    ]);
  });

  it("uses leftover ticks for following FIFO orders", () => {
    const result = advanceBuildQueue(
      {
        orders: [
          { buildableId: "interceptor", id: "build-1", quantity: 1, remainingTicks: 1 },
          { buildableId: "interceptor", id: "build-2", quantity: 1, remainingTicks: 1 },
        ],
      },
      2,
    );

    expect(result.completed).toEqual([
      { orderId: "build-1", output: { fighter: 0, frigate: 0, harvester: 0, interceptor: 1 } },
      { orderId: "build-2", output: { fighter: 0, frigate: 0, harvester: 0, interceptor: 1 } },
    ]);
    expect(result.queue.orders).toEqual([]);
  });
});
