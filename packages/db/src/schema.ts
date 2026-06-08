import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export type ResourceStock = {
  aluminium: number;
  steel: number;
  energy: number;
};

export type ShipLoadout = {
  fighter: number;
  interceptor: number;
  frigate: number;
  harvester: number;
};

export type ProductionSource = {
  id: string;
  produces: ResourceStock;
  count: number;
};

export type ResearchSnapshot = {
  completed: readonly string[];
  active?: {
    definitionId: string;
    remainingTicks: number;
  };
};

export type BuildOrderSnapshot = {
  buildableId: string;
  quantity: number;
  remainingTicks: number;
};

export type CombatReportSnapshot = Record<string, unknown>;

export const rounds = pgTable("rounds", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 120 }).notNull(),
  status: varchar("status", { length: 32 }).notNull().default("draft"),
  tickLengthMinutes: integer("tick_length_minutes").notNull().default(30),
  currentTick: integer("current_tick").notNull().default(0),
  startsAt: timestamp("starts_at", { withTimezone: true }),
  endsAt: timestamp("ends_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    username: varchar("username", { length: 64 }).notNull(),
    email: varchar("email", { length: 254 }).notNull(),
    passwordHash: text("password_hash").notNull(),
    role: varchar("role", { length: 32 }).notNull().default("player"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("users_username_unique").on(table.username),
    uniqueIndex("users_email_unique").on(table.email),
  ],
);

export const sessions = pgTable(
  "sessions",
  {
    id: varchar("id", { length: 128 }).primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("sessions_user_id_idx").on(table.userId)],
);

export const players = pgTable(
  "players",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    roundId: uuid("round_id")
      .notNull()
      .references(() => rounds.id, { onDelete: "cascade" }),
    displayName: varchar("display_name", { length: 80 }).notNull(),
    isDummy: boolean("is_dummy").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("players_user_round_unique").on(table.userId, table.roundId),
    index("players_round_id_idx").on(table.roundId),
  ],
);

export const stations = pgTable(
  "stations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    playerId: uuid("player_id")
      .notNull()
      .references(() => players.id, { onDelete: "cascade" }),
    roundId: uuid("round_id")
      .notNull()
      .references(() => rounds.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 120 }).notNull(),
    x: integer("x").notNull(),
    y: integer("y").notNull(),
    resources: jsonb("resources").$type<ResourceStock>().notNull(),
    production: jsonb("production").$type<ProductionSource[]>().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("stations_player_round_unique").on(table.playerId, table.roundId),
    uniqueIndex("stations_round_position_unique").on(table.roundId, table.x, table.y),
  ],
);

export const stationShips = pgTable("station_ships", {
  stationId: uuid("station_id")
    .primaryKey()
    .references(() => stations.id, { onDelete: "cascade" }),
  ships: jsonb("ships").$type<ShipLoadout>().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const researchStates = pgTable("research_states", {
  stationId: uuid("station_id")
    .primaryKey()
    .references(() => stations.id, { onDelete: "cascade" }),
  state: jsonb("state").$type<ResearchSnapshot>().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const buildOrders = pgTable(
  "build_orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    stationId: uuid("station_id")
      .notNull()
      .references(() => stations.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
    order: jsonb("order").$type<BuildOrderSnapshot>().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("build_orders_station_position_idx").on(table.stationId, table.position)],
);

export const fleets = pgTable(
  "fleets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    roundId: uuid("round_id")
      .notNull()
      .references(() => rounds.id, { onDelete: "cascade" }),
    ownerPlayerId: uuid("owner_player_id")
      .notNull()
      .references(() => players.id, { onDelete: "cascade" }),
    mission: varchar("mission", { length: 32 }).notNull(),
    status: varchar("status", { length: 32 }).notNull(),
    originX: integer("origin_x").notNull(),
    originY: integer("origin_y").notNull(),
    destinationX: integer("destination_x").notNull(),
    destinationY: integer("destination_y").notNull(),
    ships: jsonb("ships").$type<ShipLoadout>().notNull(),
    totalTicks: integer("total_ticks").notNull(),
    remainingTicks: integer("remaining_ticks").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("fleets_round_status_idx").on(table.roundId, table.status)],
);

export const combatReports = pgTable(
  "combat_reports",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    roundId: uuid("round_id")
      .notNull()
      .references(() => rounds.id, { onDelete: "cascade" }),
    tickNumber: integer("tick_number").notNull(),
    attackerPlayerId: uuid("attacker_player_id").references(() => players.id, {
      onDelete: "set null",
    }),
    defenderPlayerId: uuid("defender_player_id").references(() => players.id, {
      onDelete: "set null",
    }),
    report: jsonb("report").$type<CombatReportSnapshot>().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("combat_reports_round_tick_idx").on(table.roundId, table.tickNumber)],
);

export const tickRuns = pgTable(
  "tick_runs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    roundId: uuid("round_id")
      .notNull()
      .references(() => rounds.id, { onDelete: "cascade" }),
    tickNumber: integer("tick_number").notNull(),
    status: varchar("status", { length: 32 }).notNull(),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
    finishedAt: timestamp("finished_at", { withTimezone: true }),
    summary: jsonb("summary").$type<Record<string, unknown>>().notNull().default({}),
  },
  (table) => [uniqueIndex("tick_runs_round_tick_unique").on(table.roundId, table.tickNumber)],
);
