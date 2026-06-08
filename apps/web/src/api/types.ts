export type ResourceStock = {
  aluminium: number;
  steel: number;
  energy: number;
};

export type ShipType = "fighter" | "interceptor" | "frigate" | "harvester";
export type ResearchType = "shipbuilding" | "frigateEngineering" | "industrialLogistics";

export type ShipLoadout = Record<ShipType, number>;

export type User = {
  id: string;
  username: string;
  email: string;
  role: string;
};

export type AuthResponse = {
  user: User;
};

export type BuildableDefinition = {
  id: ShipType;
  kind: "ship";
  cost: ResourceStock;
  buildTimeTicks: number;
  output: Partial<ShipLoadout>;
};

export type ShipDefinition = {
  id: ShipType;
  displayName: string;
  class: "combat" | "economic";
  cost: ResourceStock;
  buildTimeTicks: number;
  attack: number;
  durability: number;
  cargo: number;
};

export type ResearchDefinition = {
  id: ResearchType;
  displayName: string;
  cost: ResourceStock;
  durationTicks: number;
  prerequisites: ResearchType[];
  unlocks: Array<{ kind: string; shipTypeId?: ShipType; sourceId?: string }>;
};

export type BuildOrder = {
  id: string;
  buildableId: ShipType;
  quantity: number;
  remainingTicks: number;
};

export type ResearchState = {
  completed: ResearchType[];
  active?: {
    definitionId: ResearchType;
    remainingTicks: number;
  };
};

export type Station = {
  id: string;
  name: string;
  x: number;
  y: number;
  resources: ResourceStock;
  production: Array<{ id: string; count: number; produces: ResourceStock }>;
  buildQueue: BuildOrder[];
  research: ResearchState;
  ships: ShipLoadout;
};

export type Round = {
  id: string;
  name: string;
  status: string;
  currentTick: number;
  tickLengthMinutes: number;
};

export type TargetStation = {
  id: string;
  name: string;
  x: number;
  y: number;
};

export type Fleet = {
  id: string;
  mission: "attack" | "return";
  status: "inTransit" | "arrived";
  originX: number;
  originY: number;
  destinationX: number;
  destinationY: number;
  ships: ShipLoadout;
  totalTicks: number;
  remainingTicks: number;
};

export type CombatReport = {
  id: string;
  tickNumber: number;
  report: {
    id: string;
    outcome: "attacker_wins" | "defender_wins" | "mutual_destruction" | "no_combat";
    attackerBefore: ShipLoadout;
    defenderBefore: ShipLoadout;
    attackerLosses: ShipLoadout;
    defenderLosses: ShipLoadout;
    attackerRemaining: ShipLoadout;
    defenderRemaining: ShipLoadout;
  };
};

export type GameSnapshot = {
  catalog: {
    buildables: Record<ShipType, BuildableDefinition>;
    research: Record<ResearchType, ResearchDefinition>;
    ships: Record<ShipType, ShipDefinition>;
  };
  player: { id: string; displayName: string };
  round: Round;
  station: Station;
  activeFleets: Fleet[];
  targets: TargetStation[];
  recentCombatReports: CombatReport[];
};

export type ApiErrorBody = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
};
