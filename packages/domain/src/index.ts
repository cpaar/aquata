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

export type ShipClass = "lt" | "md" | "fr" | "hv" | "economic";

export type ShipTrait = "normal" | "emp" | "firstStrike" | "hack";

export type ShipTypeId =
  | "piranha"
  | "qualle"
  | "hai"
  | "hackboot"
  | "taifun"
  | "tsunami"
  | "blizzard"
  | "hurricane"
  | "bermuda"
  | "kittyHawk"
  | "enterprise"
  | "atlantis"
  | "harvester";

export type ShipTypeDefinition = {
  id: ShipTypeId;
  legacyId?: number;
  displayName: string;
  class: ShipClass;
  trait: ShipTrait;
  cost: ResourceStock;
  buildTimeTicks: number;
  attack: number;
  durability: number;
  cargo: number;
};

export type ShipLoadout = Partial<Record<ShipTypeId, number>>;

export type ShipDefinitions = Record<ShipTypeId, ShipTypeDefinition>;

export const phase4ShipDefinitionsVersion = "phase-4-legacy-catalog-2026-06-08";
export const mvpShipDefinitionsVersion = phase4ShipDefinitionsVersion;

export const shipTypeIds = [
  "piranha",
  "qualle",
  "hai",
  "hackboot",
  "taifun",
  "tsunami",
  "blizzard",
  "hurricane",
  "bermuda",
  "kittyHawk",
  "enterprise",
  "atlantis",
  "harvester",
] as const satisfies readonly ShipTypeId[];

export const combatShipTypeIds = shipTypeIds.filter(
  (shipType): shipType is Exclude<ShipTypeId, "harvester"> => shipType !== "harvester",
);

export const phase4ShipDefinitions: ShipDefinitions = {
  atlantis: legacyCombatShip({
    attack: 210,
    buildTimeTicks: 12,
    class: "hv",
    durability: 516,
    legacyId: 7,
    name: "Atlantis",
    trait: "normal",
    aluminium: 70,
    steel: 16,
  }),
  bermuda: legacyCombatShip({
    attack: 78,
    buildTimeTicks: 8,
    class: "hv",
    durability: 180,
    legacyId: 10,
    name: "Bermuda",
    trait: "emp",
    aluminium: 14,
    steel: 12,
  }),
  blizzard: legacyCombatShip({
    attack: 34,
    buildTimeTicks: 5,
    class: "fr",
    durability: 62,
    legacyId: 9,
    name: "Blizzard",
    trait: "emp",
    aluminium: 2,
    steel: 8,
  }),
  enterprise: legacyCombatShip({
    attack: 96,
    buildTimeTicks: 8,
    class: "hv",
    durability: 160,
    legacyId: 6,
    name: "Enterprise",
    trait: "normal",
    aluminium: 24,
    steel: 6,
  }),
  hackboot: legacyCombatShip({
    attack: 9,
    buildTimeTicks: 3,
    class: "md",
    durability: 12,
    legacyId: 4,
    name: "Hackboot",
    trait: "hack",
    aluminium: 2,
    steel: 0.75,
  }),
  hai: legacyCombatShip({
    attack: 10,
    buildTimeTicks: 3,
    class: "md",
    durability: 14,
    legacyId: 2,
    name: "Hai",
    trait: "normal",
    aluminium: 2,
    steel: 1,
  }),
  harvester: {
    attack: 0,
    buildTimeTicks: 3,
    cargo: 100,
    class: "economic",
    cost: { aluminium: 70, energy: 30, steel: 30 },
    displayName: "Harvester",
    durability: 8,
    id: "harvester",
    trait: "normal",
  },
  hurricane: legacyCombatShip({
    attack: 52,
    buildTimeTicks: 6,
    class: "fr",
    durability: 52,
    legacyId: 11,
    name: "Hurricane",
    trait: "firstStrike",
    aluminium: 10,
    steel: 3,
  }),
  kittyHawk: legacyCombatShip({
    attack: 120,
    buildTimeTicks: 10,
    class: "hv",
    durability: 170,
    legacyId: 12,
    name: "Kitty Hawk",
    trait: "firstStrike",
    aluminium: 36,
    steel: 9,
  }),
  piranha: legacyCombatShip({
    attack: 2,
    buildTimeTicks: 1,
    class: "lt",
    durability: 3,
    legacyId: 1,
    name: "Piranha",
    trait: "firstStrike",
    aluminium: 1.5,
    steel: 0,
  }),
  qualle: legacyCombatShip({
    attack: 1,
    buildTimeTicks: 1,
    class: "lt",
    durability: 3,
    legacyId: 8,
    name: "Qualle",
    trait: "emp",
    aluminium: 0,
    steel: 1.5,
  }),
  taifun: legacyCombatShip({
    attack: 30,
    buildTimeTicks: 5,
    class: "fr",
    durability: 35,
    legacyId: 3,
    name: "Taifun",
    trait: "normal",
    aluminium: 6.75,
    steel: 2,
  }),
  tsunami: legacyCombatShip({
    attack: 44,
    buildTimeTicks: 6,
    class: "fr",
    durability: 58,
    legacyId: 5,
    name: "Tsunami",
    trait: "normal",
    aluminium: 12,
    steel: 4,
  }),
};

export const mvpShipDefinitions = phase4ShipDefinitions;

export function getShipType(
  id: ShipTypeId,
  definitions: ShipDefinitions = phase4ShipDefinitions,
): ShipTypeDefinition {
  return definitions[id];
}

export function normalizeLoadout(loadout: ShipLoadout): Record<ShipTypeId, number> {
  return Object.fromEntries(
    shipTypeIds.map((shipType) => [shipType, loadout[shipType] ?? 0]),
  ) as Record<ShipTypeId, number>;
}

export function addLoadouts(left: ShipLoadout, right: ShipLoadout): Record<ShipTypeId, number> {
  const normalizedLeft = normalizeLoadout(left);
  const normalizedRight = normalizeLoadout(right);

  return Object.fromEntries(
    shipTypeIds.map((shipType) => [shipType, normalizedLeft[shipType] + normalizedRight[shipType]]),
  ) as Record<ShipTypeId, number>;
}

export function subtractLoadouts(
  left: ShipLoadout,
  right: ShipLoadout,
): Record<ShipTypeId, number> {
  const normalizedLeft = normalizeLoadout(left);
  const normalizedRight = normalizeLoadout(right);
  const result = Object.fromEntries(
    shipTypeIds.map((shipType) => [shipType, normalizedLeft[shipType] - normalizedRight[shipType]]),
  ) as Record<ShipTypeId, number>;

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
  definitions: ShipDefinitions = phase4ShipDefinitions,
): ResourceStock {
  return shipTypeIds.reduce((total, shipType) => {
    const count = normalizeLoadout(loadout)[shipType];
    assertNonNegativeInteger(count, `${shipType} count`);
    return addResources(total, multiplyResources(definitions[shipType].cost, count));
  }, emptyResources());
}

export function calculateFleetPower(
  loadout: ShipLoadout,
  definitions: ShipDefinitions = phase4ShipDefinitions,
): { attack: number; durability: number } {
  return shipTypeIds.reduce(
    (total, shipType) => {
      const count = normalizeLoadout(loadout)[shipType];
      assertNonNegativeInteger(count, `${shipType} count`);
      const definition = definitions[shipType];
      return {
        attack: total.attack + attackWithTraitHook(definition) * count,
        durability: total.durability + definition.durability * count,
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
    unlocks: [
      { kind: "ship", shipTypeId: "taifun" },
      { kind: "ship", shipTypeId: "tsunami" },
      { kind: "ship", shipTypeId: "blizzard" },
      { kind: "ship", shipTypeId: "hurricane" },
    ],
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
      { kind: "ship", shipTypeId: "piranha" },
      { kind: "ship", shipTypeId: "qualle" },
      { kind: "ship", shipTypeId: "hai" },
      { kind: "ship", shipTypeId: "hackboot" },
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

export const mvpBuildables = Object.fromEntries(
  shipTypeIds.map((shipType) => [shipType, shipBuildable(shipType)]),
) as Record<ShipTypeId, BuildableDefinition>;

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

export type FleetMission = "attack" | "defend" | "return";

export type FleetMovementStatus = "inTransit" | "stationed" | "returning";

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
  stationTicks: number;
  stationTicksRemaining: number;
  recalled: boolean;
};

export function createFleetMovement(input: {
  id: string;
  ownerId: string;
  mission: Exclude<FleetMission, "return">;
  origin: Coordinate;
  destination: Coordinate;
  ships: ShipLoadout;
  stationTicks?: number;
  travelConfig?: TravelConfig;
}): FleetMovement {
  if (isFleetEmpty(input.ships)) {
    throw new Error("Cannot create an empty fleet movement");
  }

  if (calculateDistance(input.origin, input.destination) === 0) {
    throw new Error("Fleet destination must differ from origin");
  }

  const stationTicks = input.stationTicks ?? 1;
  validateStationTicks(input.mission, stationTicks);
  const totalTicks = calculateTravelTicks(input.origin, input.destination, input.travelConfig);

  return {
    destination: { ...input.destination },
    id: input.id,
    mission: input.mission,
    origin: { ...input.origin },
    ownerId: input.ownerId,
    recalled: false,
    remainingTicks: totalTicks,
    ships: normalizeLoadout(input.ships),
    stationTicks,
    stationTicksRemaining: stationTicks,
    status: "inTransit",
    totalTicks,
  };
}

export function advanceFleetMovement(fleet: FleetMovement, ticks = 1): FleetMovement {
  assertNonNegativeInteger(ticks, "Fleet movement ticks");

  if (fleet.status === "stationed") {
    return { ...fleet, ships: { ...fleet.ships } };
  }

  const remainingTicks = Math.max(0, fleet.remainingTicks - ticks);

  if (remainingTicks === 0 && fleet.status === "returning") {
    return { ...fleet, remainingTicks, ships: { ...fleet.ships } };
  }

  return {
    ...fleet,
    remainingTicks,
    ships: { ...fleet.ships },
    status: remainingTicks === 0 ? "stationed" : fleet.status,
  };
}

export function hasArrived(fleet: FleetMovement): boolean {
  return (
    fleet.status === "stationed" || (fleet.status === "returning" && fleet.remainingTicks === 0)
  );
}

export function recallFleetMovement(fleet: FleetMovement): FleetMovement {
  if (fleet.status === "returning") {
    throw new Error("Fleet is already returning");
  }

  const elapsedOutboundTicks = Math.max(1, fleet.totalTicks - fleet.remainingTicks);
  const returnTicks = fleet.status === "stationed" ? fleet.totalTicks : elapsedOutboundTicks;

  return {
    ...fleet,
    destination: { ...fleet.origin },
    origin: { ...fleet.destination },
    recalled: true,
    remainingTicks: returnTicks,
    ships: { ...fleet.ships },
    status: "returning",
  };
}

export type CombatRole = "attacker" | "defender";

export type CombatSide = {
  ownerId: string;
  ships: ShipLoadout;
};

export type CombatParticipant = CombatSide & {
  id: string;
  role: CombatRole;
  source: "fleet" | "station";
};

export type CombatOutcome = "attacker_wins" | "defender_wins" | "mutual_destruction" | "no_combat";

export type CombatInput = {
  id: string;
  attacker: CombatSide;
  defender: CombatSide;
};

export type CombatV2Input = {
  id: string;
  attackers: readonly CombatParticipant[];
  defenders: readonly CombatParticipant[];
};

export type CombatParticipantResult = CombatParticipant & {
  before: Record<ShipTypeId, number>;
  losses: Record<ShipTypeId, number>;
  remaining: Record<ShipTypeId, number>;
};

export type CombatReport = {
  id: string;
  version: "combat-v2-2026-06-08";
  attackerOwnerId: string;
  defenderOwnerId: string;
  outcome: CombatOutcome;
  attackerBefore: Record<ShipTypeId, number>;
  defenderBefore: Record<ShipTypeId, number>;
  attackerLosses: Record<ShipTypeId, number>;
  defenderLosses: Record<ShipTypeId, number>;
  attackerRemaining: Record<ShipTypeId, number>;
  defenderRemaining: Record<ShipTypeId, number>;
  participants: CombatParticipantResult[];
};

export function simulateCombat(
  input: CombatInput,
  definitions: ShipDefinitions = phase4ShipDefinitions,
): CombatReport {
  return simulateCombatV2(
    {
      attackers: [
        {
          id: "attacker",
          ownerId: input.attacker.ownerId,
          role: "attacker",
          ships: input.attacker.ships,
          source: "fleet",
        },
      ],
      defenders: [
        {
          id: "defender",
          ownerId: input.defender.ownerId,
          role: "defender",
          ships: input.defender.ships,
          source: "station",
        },
      ],
      id: input.id,
    },
    definitions,
  );
}

export function simulateCombatV2(
  input: CombatV2Input,
  definitions: ShipDefinitions = phase4ShipDefinitions,
): CombatReport {
  const attackerBefore = aggregateParticipants(input.attackers);
  const defenderBefore = aggregateParticipants(input.defenders);

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
  const attackerResults = distributeParticipantLosses(input.attackers, attackerLosses);
  const defenderResults = distributeParticipantLosses(input.defenders, defenderLosses);

  return {
    attackerBefore,
    attackerLosses,
    attackerOwnerId: input.attackers[0]?.ownerId ?? "unknown-attacker",
    attackerRemaining,
    defenderBefore,
    defenderLosses,
    defenderOwnerId: input.defenders[0]?.ownerId ?? "unknown-defender",
    defenderRemaining,
    id: input.id,
    outcome: determineCombatOutcome(
      attackerAlive,
      defenderAlive,
      attackerPower.attack,
      defenderPower.attack,
    ),
    participants: [...attackerResults, ...defenderResults],
    version: "combat-v2-2026-06-08",
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

  const advancedFleets = input.fleets.map((fleet) => advanceFleetMovement(fleet));
  const returnedFleetIds = new Set<string>();
  const consumedFleetIds = new Set<string>();
  const survivingFleetsById = new Map<string, FleetMovement>();

  for (const fleet of advancedFleets) {
    if (fleet.status === "returning" && fleet.remainingTicks === 0) {
      const homeStation = stations.find(
        (station) =>
          station.ownerId === fleet.ownerId &&
          station.position.x === fleet.destination.x &&
          station.position.y === fleet.destination.y,
      );
      if (homeStation) {
        homeStation.ships = addLoadouts(homeStation.ships, fleet.ships);
      }
      returnedFleetIds.add(fleet.id);
    }
  }

  for (const station of stations) {
    const attackers = advancedFleets.filter(
      (fleet) =>
        fleet.status === "stationed" &&
        fleet.mission === "attack" &&
        sameCoordinate(fleet.destination, station.position) &&
        !returnedFleetIds.has(fleet.id),
    );
    if (attackers.length === 0) {
      continue;
    }

    const defenders = advancedFleets.filter(
      (fleet) =>
        fleet.status === "stationed" &&
        fleet.mission === "defend" &&
        sameCoordinate(fleet.destination, station.position) &&
        !returnedFleetIds.has(fleet.id),
    );

    const report = simulateCombatV2({
      attackers: attackers.map((fleet) => ({
        id: fleet.id,
        ownerId: fleet.ownerId,
        role: "attacker",
        ships: fleet.ships,
        source: "fleet",
      })),
      defenders: [
        {
          id: station.id,
          ownerId: station.ownerId,
          role: "defender",
          ships: station.ships,
          source: "station",
        },
        ...defenders.map((fleet) => ({
          id: fleet.id,
          ownerId: fleet.ownerId,
          role: "defender" as const,
          ships: fleet.ships,
          source: "fleet" as const,
        })),
      ],
      id: `combat-${input.tickNumber}-${station.id}`,
    });
    combatReports.push(report);

    for (const participant of report.participants) {
      if (participant.source === "station" && participant.id === station.id) {
        station.ships = participant.remaining;
      } else {
        const fleet = advancedFleets.find((candidate) => candidate.id === participant.id);
        if (fleet) {
          fleet.ships = participant.remaining;
          if (isFleetEmpty(participant.remaining)) {
            consumedFleetIds.add(fleet.id);
          }
        }
      }
    }
  }

  for (const fleet of advancedFleets) {
    if (returnedFleetIds.has(fleet.id) || consumedFleetIds.has(fleet.id)) {
      continue;
    }

    if (fleet.status === "stationed") {
      const stationTicksRemaining = Math.max(0, fleet.stationTicksRemaining - 1);
      if (stationTicksRemaining === 0) {
        survivingFleetsById.set(fleet.id, startReturnTrip(fleet));
      } else {
        survivingFleetsById.set(fleet.id, {
          ...fleet,
          ships: { ...fleet.ships },
          stationTicksRemaining,
        });
      }
    } else {
      survivingFleetsById.set(fleet.id, fleet);
    }
  }

  return {
    combatReports,
    completedBuilds,
    completedResearch,
    fleets: [...survivingFleetsById.values()],
    stations,
    tickNumber: input.tickNumber,
  };
}

export type StationScanInput = {
  id: string;
  scannerPlayerId: string;
  target: TickStationSnapshot;
  visibleFleets?: readonly FleetMovement[];
  tickNumber: number;
  createdAt?: Date;
};

export type StationScanReport = {
  id: string;
  type: "stationScan";
  scannerPlayerId: string;
  targetStationId: string;
  targetOwnerId: string;
  tickNumber: number;
  createdAt: string;
  result: {
    position: Coordinate;
    resources: ResourceStock;
    ships: Record<ShipTypeId, number>;
    fleets: Array<{
      id: string;
      ownerId: string;
      mission: FleetMission;
      status: FleetMovementStatus;
      ships: Record<ShipTypeId, number>;
      remainingTicks: number;
      stationTicksRemaining: number;
    }>;
  };
};

export const stationScanEnergyCost = 50;
export const stationScanCost: ResourceStock = {
  aluminium: 0,
  energy: stationScanEnergyCost,
  steel: 0,
};

export function canStartStationScan(resources: ResourceStock): boolean {
  return canAfford(resources, stationScanCost);
}

export function createStationScanReport(input: StationScanInput): StationScanReport {
  return {
    createdAt: (input.createdAt ?? new Date()).toISOString(),
    id: input.id,
    result: {
      fleets: (input.visibleFleets ?? [])
        .filter((fleet) => sameCoordinate(fleet.destination, input.target.position))
        .map((fleet) => ({
          id: fleet.id,
          mission: fleet.mission,
          ownerId: fleet.ownerId,
          remainingTicks: fleet.remainingTicks,
          ships: normalizeLoadout(fleet.ships),
          stationTicksRemaining: fleet.stationTicksRemaining,
          status: fleet.status,
        })),
      position: { ...input.target.position },
      resources: { ...input.target.resources },
      ships: normalizeLoadout(input.target.ships),
    },
    scannerPlayerId: input.scannerPlayerId,
    targetOwnerId: input.target.ownerId,
    targetStationId: input.target.id,
    tickNumber: input.tickNumber,
    type: "stationScan",
  };
}

export function startStationScan(
  resources: ResourceStock,
  input: StationScanInput,
): { resources: ResourceStock; report: StationScanReport } {
  if (!canStartStationScan(resources)) {
    throw new Error("Insufficient energy for station scan");
  }

  return {
    report: createStationScanReport(input),
    resources: subtractResources(resources, stationScanCost),
  };
}

function mapResources(
  _resources: ResourceStock,
  mapper: (type: ResourceType) => number,
): ResourceStock {
  return {
    aluminium: mapper("aluminium"),
    energy: mapper("energy"),
    steel: mapper("steel"),
  };
}

function legacyCombatShip(input: {
  legacyId: number;
  name: string;
  class: Exclude<ShipClass, "economic">;
  trait: ShipTrait;
  aluminium: number;
  steel: number;
  buildTimeTicks: number;
  attack: number;
  durability: number;
}): ShipTypeDefinition {
  const id = legacyNameToId(input.name);
  return {
    attack: input.attack,
    buildTimeTicks: input.buildTimeTicks,
    cargo: 0,
    class: input.class,
    cost: {
      aluminium: Math.round(input.aluminium * 50),
      energy: 0,
      steel: Math.round(input.steel * 50),
    },
    displayName: input.name,
    durability: input.durability,
    id,
    legacyId: input.legacyId,
    trait: input.trait,
  };
}

function legacyNameToId(name: string): ShipTypeId {
  const id = name.replaceAll(" ", "");
  return `${id.charAt(0).toLowerCase()}${id.slice(1)}` as ShipTypeId;
}

function shipBuildable(shipTypeId: ShipTypeId): BuildableDefinition {
  const ship = phase4ShipDefinitions[shipTypeId];
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
  return Object.fromEntries(
    shipTypeIds.map((shipType) => [shipType, normalized[shipType] * factor]),
  ) as Record<ShipTypeId, number>;
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

function attackWithTraitHook(definition: ShipTypeDefinition): number {
  if (definition.trait === "firstStrike") {
    return definition.attack * 1.15;
  }

  if (definition.trait === "emp") {
    return definition.attack * 0.8;
  }

  return definition.attack;
}

function aggregateParticipants(
  participants: readonly CombatParticipant[],
): Record<ShipTypeId, number> {
  return participants.reduce(
    (total, participant) => addLoadouts(total, participant.ships),
    normalizeLoadout({}),
  );
}

function distributeParticipantLosses(
  participants: readonly CombatParticipant[],
  aggregateLosses: Record<ShipTypeId, number>,
): CombatParticipantResult[] {
  const remainingLosses = { ...aggregateLosses };

  return participants.map((participant) => {
    const before = normalizeLoadout(participant.ships);
    const losses = normalizeLoadout({});
    for (const shipType of shipTypeIds) {
      const destroyed = Math.min(before[shipType], remainingLosses[shipType]);
      losses[shipType] = destroyed;
      remainingLosses[shipType] -= destroyed;
    }

    return {
      ...participant,
      before,
      losses,
      remaining: subtractLoadouts(before, losses),
      ships: before,
    };
  });
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

function startReturnTrip(fleet: FleetMovement): FleetMovement {
  return {
    ...fleet,
    destination: { ...fleet.origin },
    origin: { ...fleet.destination },
    remainingTicks: fleet.totalTicks,
    ships: { ...fleet.ships },
    status: "returning",
  };
}

function validateStationTicks(
  mission: Exclude<FleetMission, "return">,
  stationTicks: number,
): void {
  assertPositiveInteger(stationTicks, "Station ticks");
  const max = mission === "defend" ? 6 : 3;
  if (stationTicks > max) {
    throw new Error(`${mission} fleets can station for at most ${max} ticks`);
  }
}

function sameCoordinate(left: Coordinate, right: Coordinate): boolean {
  return left.x === right.x && left.y === right.y;
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
