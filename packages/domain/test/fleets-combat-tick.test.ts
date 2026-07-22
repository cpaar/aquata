import { describe, expect, it } from "vitest";

import {
  advanceFleetMovement,
  createFleetMovement,
  recallFleetMovement,
  runGameTick,
  simulateCombat,
  startStationScan,
  stationScanEnergyCost,
  type FleetMovement,
  type TickStationSnapshot,
} from "../src/index.js";

describe("fleet movement, stationing, and recall", () => {
  it("creates deterministic attack movement with bounded station ticks", () => {
    const fleet = createFleetMovement({
      destination: { x: 10, y: 0 },
      id: "fleet-1",
      mission: "attack",
      origin: { x: 0, y: 0 },
      ownerId: "player-1",
      ships: { piranha: 2 },
      stationTicks: 3,
    });

    expect(fleet.totalTicks).toBe(4);
    expect(fleet.remainingTicks).toBe(4);
    expect(fleet.stationTicksRemaining).toBe(3);
    expect(fleet.status).toBe("inTransit");
  });

  it("advances movement until stationing and supports early recall", () => {
    const fleet = createFleetMovement({
      destination: { x: 11, y: 0 },
      id: "fleet-1",
      mission: "defend",
      origin: { x: 0, y: 0 },
      ownerId: "player-1",
      ships: { qualle: 1 },
      stationTicks: 6,
    });

    expect(advanceFleetMovement(fleet, 4).status).toBe("inTransit");
    expect(advanceFleetMovement(fleet, 5).status).toBe("stationed");

    const recalled = recallFleetMovement(advanceFleetMovement(fleet, 2));
    expect(recalled.status).toBe("returning");
    expect(recalled.remainingTicks).toBe(2);
    expect(recalled.recalled).toBe(true);
  });

  it("rejects invalid destinations, empty fleets, and excessive station ticks", () => {
    expect(() =>
      createFleetMovement({
        destination: { x: 1, y: 1 },
        id: "fleet-1",
        mission: "attack",
        origin: { x: 1, y: 1 },
        ownerId: "player-1",
        ships: { piranha: 1 },
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
    expect(() =>
      createFleetMovement({
        destination: { x: 2, y: 1 },
        id: "fleet-3",
        mission: "attack",
        origin: { x: 1, y: 1 },
        ownerId: "player-1",
        ships: { piranha: 1 },
        stationTicks: 4,
      }),
    ).toThrow("attack fleets can station for at most 3 ticks");
  });
});

describe("deterministic combat v2", () => {
  it("resolves clear attacker superiority in one combat tick", () => {
    const report = simulateCombat({
      attacker: { ownerId: "attacker", ships: { hai: 2 } },
      defender: { ownerId: "defender", ships: { piranha: 1 } },
      id: "combat-1",
    });

    expect(report.defenderLosses.piranha).toBe(1);
    expect(report.outcome).toBe("attacker_wins");
    expect(report.version).toBe("combat-v2-2026-06-08");
  });

  it("keeps durable equal fleets alive and uses power as deterministic tiebreaker", () => {
    const report = simulateCombat({
      attacker: { ownerId: "attacker", ships: { hai: 1 } },
      defender: { ownerId: "defender", ships: { hai: 1 } },
      id: "combat-2",
    });

    expect(report.attackerLosses.hai).toBe(0);
    expect(report.defenderLosses.hai).toBe(0);
    expect(report.outcome).toBe("defender_wins");
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
    const attacker: TickStationSnapshot = station("station-a", "attacker", { x: 0, y: 0 }, {});
    attacker.buildQueue = {
      orders: [{ buildableId: "piranha", id: "build-1", quantity: 1, remainingTicks: 1 }],
    };
    attacker.production = [
      { count: 1, id: "mine", produces: { aluminium: 5, energy: 1, steel: 3 } },
    ];
    attacker.research = {
      active: { definitionId: "shipbuilding", remainingTicks: 1 },
      completed: [],
    };
    attacker.resources = { aluminium: 10, energy: 10, steel: 10 };

    const defender = station("station-d", "defender", { x: 4, y: 0 }, { piranha: 1 });
    const fleet: FleetMovement = {
      destination: { x: 4, y: 0 },
      id: "fleet-1",
      mission: "attack",
      origin: { x: 0, y: 0 },
      ownerId: "attacker",
      recalled: false,
      remainingTicks: 1,
      ships: station("tmp", "tmp", { x: 0, y: 0 }, { hai: 1 }).ships,
      stationTicks: 1,
      stationTicksRemaining: 1,
      status: "inTransit",
      totalTicks: 4,
    };

    const result = runGameTick({
      fleets: [fleet],
      stations: [attacker, defender],
      tickNumber: 12,
    });

    expect(result.stations[0]?.resources).toEqual({ aluminium: 15, energy: 11, steel: 13 });
    expect(result.stations[0]?.ships.piranha).toBe(1);
    expect(result.completedBuilds[0]?.completed[0]?.output.piranha).toBe(1);
    expect(result.completedResearch).toEqual([
      { researchId: "shipbuilding", stationId: "station-a" },
    ]);
    expect(result.combatReports).toHaveLength(1);
    expect(result.combatReports[0]?.outcome).toBe("attacker_wins");
    expect(result.stations[1]?.ships.piranha).toBe(0);
    expect(result.fleets).toEqual([
      expect.objectContaining({
        mission: "attack",
        ownerId: "attacker",
        remainingTicks: 4,
        status: "returning",
      }),
    ]);
  });

  it("includes stationed defense fleets in combat reports", () => {
    const target = station("station-d", "defender", { x: 4, y: 0 }, { piranha: 1 });
    const attackerFleet: FleetMovement = fleet("attack-fleet", "attacker", "attack", {
      piranha: 3,
    });
    const defenseFleet: FleetMovement = fleet("defense-fleet", "ally", "defend", { hai: 1 });

    const result = runGameTick({
      fleets: [attackerFleet, defenseFleet],
      stations: [station("station-a", "attacker", { x: 0, y: 0 }, {}), target],
      tickNumber: 5,
    });

    expect(result.combatReports[0]?.participants).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "defense-fleet", role: "defender", source: "fleet" }),
      ]),
    );
    expect(result.fleets.find((candidate) => candidate.id === "defense-fleet")?.ships.hai).toBe(1);
  });
});

describe("station scans", () => {
  it("charges fixed energy and returns exact station values", () => {
    const result = startStationScan(
      { aluminium: 100, energy: stationScanEnergyCost, steel: 100 },
      {
        id: "scan-1",
        scannerPlayerId: "scanner",
        target: station("station-d", "defender", { x: 8, y: 2 }, { piranha: 2, qualle: 1 }),
        tickNumber: 7,
      },
    );

    expect(result.resources.energy).toBe(0);
    expect(result.report.result.position).toEqual({ x: 8, y: 2 });
    expect(result.report.result.ships.piranha).toBe(2);
    expect(result.report.result.ships.qualle).toBe(1);
  });

  it("rejects scans without enough energy", () => {
    expect(() =>
      startStationScan(
        { aluminium: 100, energy: stationScanEnergyCost - 1, steel: 100 },
        {
          id: "scan-1",
          scannerPlayerId: "scanner",
          target: station("station-d", "defender", { x: 8, y: 2 }, {}),
          tickNumber: 7,
        },
      ),
    ).toThrow("Insufficient energy for station scan");
  });
});

function station(
  id: string,
  ownerId: string,
  position: { x: number; y: number },
  ships: Partial<TickStationSnapshot["ships"]>,
): TickStationSnapshot {
  return {
    buildQueue: { orders: [] },
    id,
    ownerId,
    position,
    production: [],
    research: { completed: [] },
    resources: { aluminium: 0, energy: 0, steel: 0 },
    ships: {
      atlantis: 0,
      bermuda: 0,
      blizzard: 0,
      enterprise: 0,
      hackboot: 0,
      hai: 0,
      harvester: 0,
      hurricane: 0,
      kittyHawk: 0,
      piranha: 0,
      qualle: 0,
      taifun: 0,
      tsunami: 0,
      ...ships,
    },
  };
}

function fleet(
  id: string,
  ownerId: string,
  mission: "attack" | "defend",
  ships: Partial<TickStationSnapshot["ships"]>,
): FleetMovement {
  return {
    destination: { x: 4, y: 0 },
    id,
    mission,
    origin: { x: 0, y: 0 },
    ownerId,
    recalled: false,
    remainingTicks: 0,
    ships: station("tmp", "tmp", { x: 0, y: 0 }, ships).ships,
    stationTicks: 2,
    stationTicksRemaining: 2,
    status: "stationed",
    totalTicks: 4,
  };
}
