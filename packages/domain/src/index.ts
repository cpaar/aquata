export const resourceTypes = ["aluminium", "steel", "energy"] as const;

export type ResourceType = (typeof resourceTypes)[number];

export type ResourceStock = Record<ResourceType, number>;

export type ResourceDelta = ResourceStock;

export const emptyResources = (): ResourceStock => ({
  aluminium: 0,
  energy: 0,
  steel: 0,
});

export function addResources(current: ResourceStock, delta: ResourceDelta): ResourceStock {
  return mapResources(current, (type) => current[type] + delta[type]);
}

export function subtractResources(current: ResourceStock, cost: ResourceStock): ResourceStock {
  if (!canAfford(current, cost)) {
    throw new Error("Insufficient resources");
  }

  return mapResources(current, (type) => current[type] - cost[type]);
}

export function canAfford(current: ResourceStock, cost: ResourceStock): boolean {
  return resourceTypes.every((type) => current[type] >= cost[type]);
}

export function multiplyResources(resources: ResourceStock, factor: number): ResourceStock {
  assertFiniteNumber(factor, "Resource multiplier");
  return mapResources(resources, (type) => resources[type] * factor);
}

export function clampResources(
  resources: ResourceStock,
  bounds: { min?: ResourceStock; max?: ResourceStock } = {},
): ResourceStock {
  const min = bounds.min ?? emptyResources();

  return mapResources(resources, (type) => {
    const lower = min[type];
    const upper = bounds.max?.[type] ?? Number.POSITIVE_INFINITY;
    return Math.min(Math.max(resources[type], lower), upper);
  });
}

export type ProductionSource = {
  id: string;
  produces: ResourceStock;
  count: number;
};

export function calculateProduction(
  sources: readonly ProductionSource[],
  ticks = 1,
): ResourceStock {
  assertNonNegativeInteger(ticks, "Production ticks");

  return sources.reduce((total, source) => {
    assertNonNegativeInteger(source.count, `Production source ${source.id} count`);
    return addResources(total, multiplyResources(source.produces, source.count * ticks));
  }, emptyResources());
}

export type Coordinate = {
  x: number;
  y: number;
};

export type TravelBand = {
  minDistance: number;
  maxDistance?: number;
  ticks: number;
};

export type TravelConfig = {
  bands: readonly TravelBand[];
  sameTileTicks: number;
};

export const mvpTravelConfig: TravelConfig = {
  bands: [
    { maxDistance: 10, minDistance: 1, ticks: 4 },
    { maxDistance: 20, minDistance: 11, ticks: 5 },
    { maxDistance: 30, minDistance: 21, ticks: 6 },
    { minDistance: 31, ticks: 7 },
  ],
  sameTileTicks: 0,
};

export function calculateDistance(origin: Coordinate, destination: Coordinate): number {
  assertCoordinate(origin, "origin");
  assertCoordinate(destination, "destination");
  return Math.hypot(destination.x - origin.x, destination.y - origin.y);
}

export function calculateTravelTicks(
  origin: Coordinate,
  destination: Coordinate,
  config: TravelConfig = mvpTravelConfig,
): number {
  const roundedDistance = Math.ceil(calculateDistance(origin, destination));

  if (roundedDistance === 0) {
    return config.sameTileTicks;
  }

  const band = config.bands.find((candidate) => {
    return (
      roundedDistance >= candidate.minDistance &&
      (candidate.maxDistance === undefined || roundedDistance <= candidate.maxDistance)
    );
  });

  if (!band) {
    throw new Error(`No travel band configured for distance ${roundedDistance}`);
  }

  return band.ticks;
}

export type ShipClass = "combat" | "economic";

export type ShipTypeId = "fighter" | "interceptor" | "frigate" | "harvester";

export type ShipTypeDefinition = {
  id: ShipTypeId;
  displayName: string;
  class: ShipClass;
  cost: ResourceStock;
  buildTimeTicks: number;
  attack: number;
  durability: number;
  cargo: number;
};

export type ShipLoadout = Partial<Record<ShipTypeId, number>>;

export type ShipDefinitions = Record<ShipTypeId, ShipTypeDefinition>;

export const mvpShipDefinitionsVersion = "mvp-2026-06-08";

export const mvpShipDefinitions: ShipDefinitions = {
  fighter: {
    attack: 8,
    buildTimeTicks: 2,
    cargo: 0,
    class: "combat",
    cost: { aluminium: 80, energy: 20, steel: 40 },
    displayName: "Fighter",
    durability: 10,
    id: "fighter",
  },
  frigate: {
    attack: 18,
    buildTimeTicks: 4,
    cargo: 0,
    class: "combat",
    cost: { aluminium: 160, energy: 60, steel: 140 },
    displayName: "Frigate",
    durability: 30,
    id: "frigate",
  },
  harvester: {
    attack: 0,
    buildTimeTicks: 3,
    cargo: 100,
    class: "economic",
    cost: { aluminium: 70, energy: 30, steel: 30 },
    displayName: "Harvester",
    durability: 8,
    id: "harvester",
  },
  interceptor: {
    attack: 5,
    buildTimeTicks: 1,
    cargo: 0,
    class: "combat",
    cost: { aluminium: 45, energy: 25, steel: 25 },
    displayName: "Interceptor",
    durability: 6,
    id: "interceptor",
  },
};

export function getShipType(
  id: ShipTypeId,
  definitions: ShipDefinitions = mvpShipDefinitions,
): ShipTypeDefinition {
  return definitions[id];
}

export function normalizeLoadout(loadout: ShipLoadout): Record<ShipTypeId, number> {
  return {
    fighter: loadout.fighter ?? 0,
    frigate: loadout.frigate ?? 0,
    harvester: loadout.harvester ?? 0,
    interceptor: loadout.interceptor ?? 0,
  };
}

export function addLoadouts(left: ShipLoadout, right: ShipLoadout): Record<ShipTypeId, number> {
  const normalizedLeft = normalizeLoadout(left);
  const normalizedRight = normalizeLoadout(right);

  return {
    fighter: normalizedLeft.fighter + normalizedRight.fighter,
    frigate: normalizedLeft.frigate + normalizedRight.frigate,
    harvester: normalizedLeft.harvester + normalizedRight.harvester,
    interceptor: normalizedLeft.interceptor + normalizedRight.interceptor,
  };
}

export function subtractLoadouts(
  left: ShipLoadout,
  right: ShipLoadout,
): Record<ShipTypeId, number> {
  const normalizedLeft = normalizeLoadout(left);
  const normalizedRight = normalizeLoadout(right);
  const result = {
    fighter: normalizedLeft.fighter - normalizedRight.fighter,
    frigate: normalizedLeft.frigate - normalizedRight.frigate,
    harvester: normalizedLeft.harvester - normalizedRight.harvester,
    interceptor: normalizedLeft.interceptor - normalizedRight.interceptor,
  };

  for (const [shipType, count] of Object.entries(result)) {
    if (count < 0) {
      throw new Error(`Cannot subtract more ${shipType} ships than available`);
    }
  }

  return result;
}

export function isFleetEmpty(loadout: ShipLoadout): boolean {
  return Object.values(normalizeLoadout(loadout)).every((count) => count === 0);
}

export function calculateFleetCost(
  loadout: ShipLoadout,
  definitions: ShipDefinitions = mvpShipDefinitions,
): ResourceStock {
  return shipTypeIds.reduce((total, shipType) => {
    const count = normalizeLoadout(loadout)[shipType];
    assertNonNegativeInteger(count, `${shipType} count`);
    return addResources(total, multiplyResources(definitions[shipType].cost, count));
  }, emptyResources());
}

export function calculateFleetPower(
  loadout: ShipLoadout,
  definitions: ShipDefinitions = mvpShipDefinitions,
): { attack: number; durability: number } {
  return shipTypeIds.reduce(
    (total, shipType) => {
      const count = normalizeLoadout(loadout)[shipType];
      assertNonNegativeInteger(count, `${shipType} count`);
      return {
        attack: total.attack + definitions[shipType].attack * count,
        durability: total.durability + definitions[shipType].durability * count,
      };
    },
    { attack: 0, durability: 0 },
  );
}

export type ResearchId = "shipbuilding" | "frigateEngineering" | "industrialLogistics";

export type UnlockRequirement = { kind: "research"; researchId: ResearchId } | { kind: "none" };

export type UnlockTarget =
  | { kind: "ship"; shipTypeId: ShipTypeId }
  | { kind: "production"; sourceId: string };

export type ResearchDefinition = {
  id: ResearchId;
  displayName: string;
  cost: ResourceStock;
  durationTicks: number;
  prerequisites: readonly ResearchId[];
  unlocks: readonly UnlockTarget[];
};

export type ResearchState = {
  completed: readonly ResearchId[];
  active?: ActiveResearch;
};

export type ActiveResearch = {
  definitionId: ResearchId;
  remainingTicks: number;
};

export const mvpResearchDefinitions: Record<ResearchId, ResearchDefinition> = {
  frigateEngineering: {
    cost: { aluminium: 180, energy: 80, steel: 220 },
    displayName: "Frigate Engineering",
    durationTicks: 4,
    id: "frigateEngineering",
    prerequisites: ["shipbuilding"],
    unlocks: [{ kind: "ship", shipTypeId: "frigate" }],
  },
  industrialLogistics: {
    cost: { aluminium: 140, energy: 100, steel: 80 },
    displayName: "Industrial Logistics",
    durationTicks: 3,
    id: "industrialLogistics",
    prerequisites: [],
    unlocks: [{ kind: "production", sourceId: "harvester-output" }],
  },
  shipbuilding: {
    cost: { aluminium: 100, energy: 40, steel: 80 },
    displayName: "Shipbuilding",
    durationTicks: 2,
    id: "shipbuilding",
    prerequisites: [],
    unlocks: [
      { kind: "ship", shipTypeId: "fighter" },
      { kind: "ship", shipTypeId: "interceptor" },
      { kind: "ship", shipTypeId: "harvester" },
    ],
  },
};

export function canStartResearch(
  state: ResearchState,
  researchId: ResearchId,
  resources: ResourceStock,
  definitions = mvpResearchDefinitions,
): boolean {
  if (state.active || state.completed.includes(researchId)) {
    return false;
  }

  const definition = definitions[researchId];
  return (
    definition.prerequisites.every((prerequisite) => state.completed.includes(prerequisite)) &&
    canAfford(resources, definition.cost)
  );
}

export function startResearch(
  state: ResearchState,
  researchId: ResearchId,
  resources: ResourceStock,
  definitions = mvpResearchDefinitions,
): { state: ResearchState; resources: ResourceStock } {
  if (!canStartResearch(state, researchId, resources, definitions)) {
    throw new Error(`Cannot start research ${researchId}`);
  }

  const definition = definitions[researchId];

  return {
    resources: subtractResources(resources, definition.cost),
    state: {
      ...state,
      active: { definitionId: researchId, remainingTicks: definition.durationTicks },
    },
  };
}

export function advanceResearch(state: ResearchState, ticks = 1): ResearchState {
  assertNonNegativeInteger(ticks, "Research ticks");

  if (!state.active || ticks === 0) {
    return { completed: [...state.completed], active: state.active };
  }

  const remainingTicks = state.active.remainingTicks - ticks;

  if (remainingTicks > 0) {
    return {
      completed: [...state.completed],
      active: { ...state.active, remainingTicks },
    };
  }

  return completeResearch(state);
}

export function completeResearch(state: ResearchState): ResearchState {
  if (!state.active) {
    return { completed: [...state.completed] };
  }

  return {
    completed: unique([...state.completed, state.active.definitionId]),
  };
}

export function isUnlocked(
  state: ResearchState,
  requirement: UnlockRequirement,
  target?: UnlockTarget,
  definitions = mvpResearchDefinitions,
): boolean {
  if (requirement.kind === "research") {
    return state.completed.includes(requirement.researchId);
  }

  if (!target) {
    return true;
  }

  return Object.values(definitions).some((definition) => {
    return (
      state.completed.includes(definition.id) &&
      definition.unlocks.some((unlock) => sameUnlockTarget(unlock, target))
    );
  });
}

export type BuildableKind = "ship";

export type BuildableDefinition = {
  id: ShipTypeId;
  kind: BuildableKind;
  cost: ResourceStock;
  buildTimeTicks: number;
  output: ShipLoadout;
};

export type BuildOrder = {
  id: string;
  buildableId: ShipTypeId;
  quantity: number;
  remainingTicks: number;
};

export type BuildQueueState = {
  orders: readonly BuildOrder[];
};

export type CompletedBuildOrder = {
  orderId: string;
  output: Record<ShipTypeId, number>;
};

export const mvpBuildables: Record<ShipTypeId, BuildableDefinition> = {
  fighter: shipBuildable("fighter"),
  frigate: shipBuildable("frigate"),
  harvester: shipBuildable("harvester"),
  interceptor: shipBuildable("interceptor"),
};

export function canStartBuild(
  resources: ResourceStock,
  buildableId: ShipTypeId,
  quantity = 1,
  buildables = mvpBuildables,
): boolean {
  assertPositiveInteger(quantity, "Build quantity");
  return canAfford(resources, multiplyResources(buildables[buildableId].cost, quantity));
}

export function startBuildOrder(
  queue: BuildQueueState,
  resources: ResourceStock,
  order: { id: string; buildableId: ShipTypeId; quantity?: number },
  buildables = mvpBuildables,
): { queue: BuildQueueState; resources: ResourceStock } {
  const quantity = order.quantity ?? 1;
  assertPositiveInteger(quantity, "Build quantity");

  if (!canStartBuild(resources, order.buildableId, quantity, buildables)) {
    throw new Error(`Cannot start build ${order.buildableId}`);
  }

  const buildable = buildables[order.buildableId];

  return {
    queue: {
      orders: [
        ...queue.orders,
        {
          buildableId: order.buildableId,
          id: order.id,
          quantity,
          remainingTicks: buildable.buildTimeTicks * quantity,
        },
      ],
    },
    resources: subtractResources(resources, multiplyResources(buildable.cost, quantity)),
  };
}

export function advanceBuildQueue(
  queue: BuildQueueState,
  ticks = 1,
  buildables = mvpBuildables,
): { queue: BuildQueueState; completed: CompletedBuildOrder[] } {
  assertNonNegativeInteger(ticks, "Build ticks");

  let availableTicks = ticks;
  const completed: CompletedBuildOrder[] = [];
  const remainingOrders = queue.orders.map((order) => ({ ...order }));

  while (availableTicks > 0 && remainingOrders.length > 0) {
    const current = remainingOrders[0];

    if (!current) {
      break;
    }

    if (current.remainingTicks > availableTicks) {
      current.remainingTicks -= availableTicks;
      availableTicks = 0;
      break;
    }

    availableTicks -= current.remainingTicks;
    remainingOrders.shift();
    completed.push({
      orderId: current.id,
      output: multiplyLoadout(buildables[current.buildableId].output, current.quantity),
    });
  }

  return {
    completed,
    queue: { orders: remainingOrders },
  };
}

export type FleetMission = "attack" | "return";

export type FleetMovementStatus = "inTransit" | "arrived";

export type FleetMovement = {
  id: string;
  ownerId: string;
  mission: FleetMission;
  origin: Coordinate;
  destination: Coordinate;
  ships: Record<ShipTypeId, number>;
  totalTicks: number;
  remainingTicks: number;
  status: FleetMovementStatus;
};

export function createFleetMovement(input: {
  id: string;
  ownerId: string;
  mission: FleetMission;
  origin: Coordinate;
  destination: Coordinate;
  ships: ShipLoadout;
  travelConfig?: TravelConfig;
}): FleetMovement {
  if (isFleetEmpty(input.ships)) {
    throw new Error("Cannot create an empty fleet movement");
  }

  if (calculateDistance(input.origin, input.destination) === 0) {
    throw new Error("Fleet destination must differ from origin");
  }

  const totalTicks = calculateTravelTicks(input.origin, input.destination, input.travelConfig);

  return {
    destination: { ...input.destination },
    id: input.id,
    mission: input.mission,
    origin: { ...input.origin },
    ownerId: input.ownerId,
    remainingTicks: totalTicks,
    ships: normalizeLoadout(input.ships),
    status: "inTransit",
    totalTicks,
  };
}

export function advanceFleetMovement(fleet: FleetMovement, ticks = 1): FleetMovement {
  assertNonNegativeInteger(ticks, "Fleet movement ticks");

  if (fleet.status === "arrived") {
    return { ...fleet, ships: { ...fleet.ships } };
  }

  const remainingTicks = Math.max(0, fleet.remainingTicks - ticks);

  return {
    ...fleet,
    remainingTicks,
    ships: { ...fleet.ships },
    status: remainingTicks === 0 ? "arrived" : "inTransit",
  };
}

export function hasArrived(fleet: FleetMovement): boolean {
  return fleet.status === "arrived";
}

export type CombatSide = {
  ownerId: string;
  ships: ShipLoadout;
};

export type CombatOutcome = "attacker_wins" | "defender_wins" | "mutual_destruction" | "no_combat";

export type CombatInput = {
  id: string;
  attacker: CombatSide;
  defender: CombatSide;
};

export type CombatReport = {
  id: string;
  attackerOwnerId: string;
  defenderOwnerId: string;
  outcome: CombatOutcome;
  attackerBefore: Record<ShipTypeId, number>;
  defenderBefore: Record<ShipTypeId, number>;
  attackerLosses: Record<ShipTypeId, number>;
  defenderLosses: Record<ShipTypeId, number>;
  attackerRemaining: Record<ShipTypeId, number>;
  defenderRemaining: Record<ShipTypeId, number>;
};

export function simulateCombat(
  input: CombatInput,
  definitions: ShipDefinitions = mvpShipDefinitions,
): CombatReport {
  const attackerBefore = normalizeLoadout(input.attacker.ships);
  const defenderBefore = normalizeLoadout(input.defender.ships);

  if (isFleetEmpty(attackerBefore) && isFleetEmpty(defenderBefore)) {
    throw new Error("Combat requires at least one ship");
  }

  const attackerPower = calculateFleetPower(attackerBefore, definitions);
  const defenderPower = calculateFleetPower(defenderBefore, definitions);
  const defenderLosses = allocateLosses(defenderBefore, attackerPower.attack, definitions);
  const attackerLosses = allocateLosses(attackerBefore, defenderPower.attack, definitions);
  const attackerRemaining = subtractLoadouts(attackerBefore, attackerLosses);
  const defenderRemaining = subtractLoadouts(defenderBefore, defenderLosses);
  const attackerAlive = !isFleetEmpty(attackerRemaining);
  const defenderAlive = !isFleetEmpty(defenderRemaining);

  return {
    attackerBefore,
    attackerLosses,
    attackerOwnerId: input.attacker.ownerId,
    attackerRemaining,
    defenderBefore,
    defenderLosses,
    defenderOwnerId: input.defender.ownerId,
    defenderRemaining,
    id: input.id,
    outcome: determineCombatOutcome(
      attackerAlive,
      defenderAlive,
      attackerPower.attack,
      defenderPower.attack,
    ),
  };
}

export type TickStationSnapshot = {
  id: string;
  ownerId: string;
  position: Coordinate;
  resources: ResourceStock;
  production: readonly ProductionSource[];
  ships: Record<ShipTypeId, number>;
  buildQueue: BuildQueueState;
  research: ResearchState;
};

export type GameTickInput = {
  tickNumber: number;
  stations: readonly TickStationSnapshot[];
  fleets: readonly FleetMovement[];
};

export type GameTickResult = {
  tickNumber: number;
  stations: TickStationSnapshot[];
  fleets: FleetMovement[];
  completedBuilds: Array<{ stationId: string; completed: CompletedBuildOrder[] }>;
  completedResearch: Array<{ stationId: string; researchId: ResearchId }>;
  combatReports: CombatReport[];
};

export function runGameTick(input: GameTickInput): GameTickResult {
  const completedBuilds: GameTickResult["completedBuilds"] = [];
  const completedResearch: GameTickResult["completedResearch"] = [];
  const combatReports: CombatReport[] = [];

  const stations = input.stations.map((station) => {
    const resources = addResources(station.resources, calculateProduction(station.production));
    const buildResult = advanceBuildQueue(station.buildQueue);
    const researchBefore = station.research.active?.definitionId;
    const research = advanceResearch(station.research);
    const ships = buildResult.completed.reduce(
      (currentShips, completed) => addLoadouts(currentShips, completed.output),
      station.ships,
    );

    if (buildResult.completed.length > 0) {
      completedBuilds.push({ completed: buildResult.completed, stationId: station.id });
    }

    if (researchBefore && !research.active && research.completed.includes(researchBefore)) {
      completedResearch.push({ researchId: researchBefore, stationId: station.id });
    }

    return {
      ...station,
      buildQueue: buildResult.queue,
      research,
      resources,
      ships,
    };
  });

  const fleets = input.fleets.map((fleet) => advanceFleetMovement(fleet));
  const survivingFleets: FleetMovement[] = [];

  for (const fleet of fleets) {
    const targetStation = stations.find(
      (station) =>
        station.position.x === fleet.destination.x && station.position.y === fleet.destination.y,
    );

    if (fleet.status === "arrived" && fleet.mission === "attack" && targetStation) {
      const report = simulateCombat({
        attacker: { ownerId: fleet.ownerId, ships: fleet.ships },
        defender: { ownerId: targetStation.ownerId, ships: targetStation.ships },
        id: `combat-${input.tickNumber}-${fleet.id}`,
      });
      combatReports.push(report);
      targetStation.ships = report.defenderRemaining;

      if (!isFleetEmpty(report.attackerRemaining)) {
        survivingFleets.push({
          ...fleet,
          mission: "return",
          origin: { ...fleet.destination },
          destination: { ...fleet.origin },
          remainingTicks: fleet.totalTicks,
          ships: report.attackerRemaining,
          status: "inTransit",
        });
      }
    } else if (fleet.status !== "arrived" || fleet.mission !== "attack") {
      survivingFleets.push(fleet);
    }
  }

  return {
    combatReports,
    completedBuilds,
    completedResearch,
    fleets: survivingFleets,
    stations,
    tickNumber: input.tickNumber,
  };
}

const shipTypeIds: readonly ShipTypeId[] = ["fighter", "interceptor", "frigate", "harvester"];

function mapResources(
  resources: ResourceStock,
  mapper: (type: ResourceType) => number,
): ResourceStock {
  for (const type of resourceTypes) {
    assertFiniteNumber(resources[type], `${type} amount`);
  }

  return {
    aluminium: mapper("aluminium"),
    energy: mapper("energy"),
    steel: mapper("steel"),
  };
}

function shipBuildable(shipTypeId: ShipTypeId): BuildableDefinition {
  const ship = mvpShipDefinitions[shipTypeId];
  return {
    buildTimeTicks: ship.buildTimeTicks,
    cost: ship.cost,
    id: shipTypeId,
    kind: "ship",
    output: { [shipTypeId]: 1 },
  };
}

function multiplyLoadout(loadout: ShipLoadout, factor: number): Record<ShipTypeId, number> {
  assertPositiveInteger(factor, "Loadout multiplier");
  const normalized = normalizeLoadout(loadout);
  return {
    fighter: normalized.fighter * factor,
    frigate: normalized.frigate * factor,
    harvester: normalized.harvester * factor,
    interceptor: normalized.interceptor * factor,
  };
}

function allocateLosses(
  loadout: Record<ShipTypeId, number>,
  incomingDamage: number,
  definitions: ShipDefinitions,
): Record<ShipTypeId, number> {
  assertFiniteNumber(incomingDamage, "Incoming combat damage");

  let remainingDamage = Math.max(0, incomingDamage);
  const losses = normalizeLoadout({});

  for (const shipType of shipTypeIds) {
    const durability = definitions[shipType].durability;
    const count = loadout[shipType];
    const destroyed =
      remainingDamage >= durability ? Math.min(count, Math.floor(remainingDamage / durability)) : 0;

    losses[shipType] = destroyed;
    remainingDamage -= destroyed * durability;
  }

  return losses;
}

function determineCombatOutcome(
  attackerAlive: boolean,
  defenderAlive: boolean,
  attackerAttack: number,
  defenderAttack: number,
): CombatOutcome {
  if (!attackerAlive && !defenderAlive) {
    return "mutual_destruction";
  }

  if (attackerAlive && !defenderAlive) {
    return "attacker_wins";
  }

  if (!attackerAlive && defenderAlive) {
    return "defender_wins";
  }

  if (attackerAttack === 0 && defenderAttack === 0) {
    return "no_combat";
  }

  return attackerAttack > defenderAttack ? "attacker_wins" : "defender_wins";
}

function sameUnlockTarget(left: UnlockTarget, right: UnlockTarget): boolean {
  if (left.kind !== right.kind) {
    return false;
  }

  if (left.kind === "ship" && right.kind === "ship") {
    return left.shipTypeId === right.shipTypeId;
  }

  if (left.kind === "production" && right.kind === "production") {
    return left.sourceId === right.sourceId;
  }

  return false;
}

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}

function assertCoordinate(coordinate: Coordinate, label: string): void {
  assertFiniteNumber(coordinate.x, `${label}.x`);
  assertFiniteNumber(coordinate.y, `${label}.y`);
}

function assertFiniteNumber(value: number, label: string): void {
  if (!Number.isFinite(value)) {
    throw new Error(`${label} must be finite`);
  }
}

function assertNonNegativeInteger(value: number, label: string): void {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${label} must be a non-negative integer`);
  }
}

function assertPositiveInteger(value: number, label: string): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${label} must be a positive integer`);
  }
}
