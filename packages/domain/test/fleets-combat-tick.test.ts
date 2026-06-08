import { describe, expect, it } from "vitest";

import {
  advanceFleetMovement,
  createFleetMovement,
  mvpShipDefinitions,
  runGameTick,
  simulateCombat,
  type FleetMovement,
  type TickStationSnapshot,
} from "../src/index.js";

describe("fleet movement", () => {
  it("creates deterministic attack movement with travel ticks", () => {
    const fleet = createFleetMovement({
      destination: { x: 10, y: 0 },
      id: "fleet-1",
      mission: "attack",
      origin: { x: 0, y: 0 },
      ownerId: "player-1",
      ships: { fighter: 2 },
    });

    expect(fleet.totalTicks).toBe(4);
    expect(fleet.remainingTicks).toBe(4);
    expect(fleet.status).toBe("inTransit");
  });

  it("advances movement until arrival", () => {
    const fleet = createFleetMovement({
      destination: { x: 11, y: 0 },
      id: "fleet-1",
      mission: "attack",
      origin: { x: 0, y: 0 },
      ownerId: "player-1",
      ships: { interceptor: 1 },
    });

    expect(advanceFleetMovement(fleet, 4).status).toBe("inTransit");
    expect(advanceFleetMovement(fleet, 5).status).toBe("arrived");
  });

  it("rejects empty fleets and same-tile destinations", () => {
    expect(() =>
      createFleetMovement({
        destination: { x: 1, y: 1 },
        id: "fleet-1",
        mission: "attack",
        origin: { x: 1, y: 1 },
        ownerId: "player-1",
        ships: { fighter: 1 },
      }),
    ).toThrow("Fleet destination must differ from origin");
    expect(() =>
      createFleetMovement({
        destination: { x: 2, y: 1 },
        id: "fleet-2",
        mission: "attack",
        origin: { x: 1, y: 1 },
        ownerId: "player-1",
        ships: {},
      }),
    ).toThrow("Cannot create an empty fleet movement");
  });
});

describe("minimal deterministic combat", () => {
  it("resolves clear attacker superiority in one tick", () => {
    expect(
      simulateCombat({
        attacker: { ownerId: "attacker", ships: { frigate: 2 } },
        defender: { ownerId: "defender", ships: { interceptor: 1 } },
        id: "combat-1",
      }),
    ).toMatchObject({
      attackerLosses: { fighter: 0, frigate: 0, harvester: 0, interceptor: 0 },
      defenderLosses: { fighter: 0, frigate: 0, harvester: 0, interceptor: 1 },
      outcome: "attacker_wins",
    });
  });

  it("can produce mutual destruction deterministically", () => {
    expect(
      simulateCombat(
        {
          attacker: { ownerId: "attacker", ships: { fighter: 1 } },
          defender: { ownerId: "defender", ships: { fighter: 1 } },
          id: "combat-2",
        },
        {
          ...mvpShipDefinitions,
          fighter: { ...mvpShipDefinitions.fighter, attack: 10, durability: 10 },
        },
      ),
    ).toMatchObject({
      attackerLosses: { fighter: 1, frigate: 0, harvester: 0, interceptor: 0 },
      defenderLosses: { fighter: 1, frigate: 0, harvester: 0, interceptor: 0 },
      outcome: "mutual_destruction",
    });
  });

  it("rejects empty combat input", () => {
    expect(() =>
      simulateCombat({
        attacker: { ownerId: "attacker", ships: {} },
        defender: { ownerId: "defender", ships: {} },
        id: "combat-empty",
      }),
    ).toThrow("Combat requires at least one ship");
  });
});

describe("tick snapshot", () => {
  it("produces resources, completes builds and research, moves fleets, and resolves arrived attacks", () => {
    const attacker: TickStationSnapshot = {
      buildQueue: {
        orders: [{ buildableId: "interceptor", id: "build-1", quantity: 1, remainingTicks: 1 }],
      },
      id: "station-a",
      ownerId: "attacker",
      position: { x: 0, y: 0 },
      production: [{ count: 1, id: "mine", produces: { aluminium: 5, energy: 1, steel: 3 } }],
      research: {
        active: { definitionId: "shipbuilding", remainingTicks: 1 },
        completed: [],
      },
      resources: { aluminium: 10, energy: 10, steel: 10 },
      ships: { fighter: 0, frigate: 0, harvester: 0, interceptor: 0 },
    };
    const defender: TickStationSnapshot = {
      buildQueue: { orders: [] },
      id: "station-d",
      ownerId: "defender",
      position: { x: 4, y: 0 },
      production: [],
      research: { completed: [] },
      resources: { aluminium: 0, energy: 0, steel: 0 },
      ships: { fighter: 0, frigate: 0, harvester: 0, interceptor: 1 },
    };
    const fleet: FleetMovement = {
      destination: { x: 4, y: 0 },
      id: "fleet-1",
      mission: "attack",
      origin: { x: 0, y: 0 },
      ownerId: "attacker",
      remainingTicks: 1,
      ships: { fighter: 0, frigate: 1, harvester: 0, interceptor: 0 },
      status: "inTransit",
      totalTicks: 4,
    };

    const result = runGameTick({
      fleets: [fleet],
      stations: [attacker, defender],
      tickNumber: 12,
    });

    expect(result.stations[0]?.resources).toEqual({ aluminium: 15, energy: 11, steel: 13 });
    expect(result.stations[0]?.ships).toEqual({
      fighter: 0,
      frigate: 0,
      harvester: 0,
      interceptor: 1,
    });
    expect(result.completedBuilds).toEqual([
      {
        completed: [
          { orderId: "build-1", output: { fighter: 0, frigate: 0, harvester: 0, interceptor: 1 } },
        ],
        stationId: "station-a",
      },
    ]);
    expect(result.completedResearch).toEqual([
      { researchId: "shipbuilding", stationId: "station-a" },
    ]);
    expect(result.combatReports).toHaveLength(1);
    expect(result.combatReports[0]?.outcome).toBe("attacker_wins");
    expect(result.stations[1]?.ships).toEqual({
      fighter: 0,
      frigate: 0,
      harvester: 0,
      interceptor: 0,
    });
    expect(result.fleets).toEqual([
      expect.objectContaining({
        mission: "return",
        ownerId: "attacker",
        remainingTicks: 4,
        status: "inTransit",
      }),
    ]);
  });
});
