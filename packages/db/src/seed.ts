import { and, eq, isNull } from "drizzle-orm";

import { createDbClient } from "./client.js";
import { players, researchStates, rounds, stationShips, stations, users } from "./schema.js";

const databaseUrl = process.env.DATABASE_URL ?? "postgres://aquata:aquata@localhost:55432/aquata";

const emptyShips = {
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
};
const dummyShips = { ...emptyShips, piranha: 2, qualle: 1 };
const playerShips = { ...emptyShips, hai: 1, harvester: 1, piranha: 4, qualle: 2 };
const playerResources = { aluminium: 500, energy: 300, steel: 400 };
const playerProduction = [
  { count: 2, id: "aluminium-collector", produces: { aluminium: 6, energy: 0, steel: 0 } },
  { count: 2, id: "steel-collector", produces: { aluminium: 0, energy: 0, steel: 5 } },
  { count: 1, id: "reactor", produces: { aluminium: 0, energy: 4, steel: 0 } },
];

async function main(): Promise<void> {
  const client = createDbClient(databaseUrl);

  try {
    const activeRound = await getOrCreateActiveRound(client.db);
    const dummyPlayer = await getOrCreateDummyPlayer(client.db, activeRound.id);
    const dummyStation = await getOrCreateDummyStation(client.db, activeRound.id, dummyPlayer.id);

    await client.db
      .insert(stationShips)
      .values({ ships: dummyShips, stationId: dummyStation.id })
      .onConflictDoNothing();
    await client.db
      .insert(researchStates)
      .values({ state: { completed: [] }, stationId: dummyStation.id })
      .onConflictDoNothing();

    if (process.env.SEED_DEV_USER === "true") {
      await client.db
        .insert(users)
        .values({
          email: "dev@aquata.local",
          passwordHash: "$argon2id$v=19$m=65536,t=3,p=4$placeholder$placeholder",
          username: "dev",
        })
        .onConflictDoNothing();
    }

    console.log(`Seeded active round ${activeRound.id}`);
  } finally {
    await client.pool.end();
  }
}

async function getOrCreateActiveRound(db: ReturnType<typeof createDbClient>["db"]) {
  const existing = await db.select().from(rounds).where(eq(rounds.status, "active")).limit(1);
  if (existing[0]) {
    return existing[0];
  }

  const [round] = await db
    .insert(rounds)
    .values({ name: "MVP Round", status: "active", tickLengthMinutes: 30 })
    .returning();
  if (!round) {
    throw new Error("Could not create active round");
  }
  return round;
}

async function getOrCreateDummyPlayer(
  db: ReturnType<typeof createDbClient>["db"],
  roundId: string,
) {
  const existing = await db
    .select()
    .from(players)
    .where(and(eq(players.roundId, roundId), eq(players.isDummy, true), isNull(players.userId)))
    .limit(1);
  if (existing[0]) {
    return existing[0];
  }

  const [player] = await db
    .insert(players)
    .values({ displayName: "Dummy Opponent", isDummy: true, roundId })
    .returning();
  if (!player) {
    throw new Error("Could not create dummy player");
  }
  return player;
}

async function getOrCreateDummyStation(
  db: ReturnType<typeof createDbClient>["db"],
  roundId: string,
  playerId: string,
) {
  const existing = await db
    .select()
    .from(stations)
    .where(and(eq(stations.roundId, roundId), eq(stations.playerId, playerId)))
    .limit(1);
  if (existing[0]) {
    return existing[0];
  }

  const [station] = await db
    .insert(stations)
    .values({
      name: "Dummy Reef",
      playerId,
      production: [],
      resources: { aluminium: 100, energy: 100, steel: 100 },
      roundId,
      x: 10,
      y: 0,
    })
    .returning();
  if (!station) {
    throw new Error("Could not create dummy station");
  }
  return station;
}

export const seedDefaults = {
  playerProduction,
  playerResources,
  playerShips,
};

await main();
