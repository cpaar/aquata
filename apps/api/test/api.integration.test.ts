/* eslint-disable @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return */
import "reflect-metadata";

import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import {
  createDbClient,
  players,
  researchStates,
  rounds,
  stationShips,
  stations,
} from "@aquata/db";
import cookieParser from "cookie-parser";
import pg from "pg";
import request from "supertest";
import { readdir, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { AppModule } from "../src/app.module.js";

const testDatabaseUrl = process.env.TEST_DATABASE_URL;
const describeIfPostgres = testDatabaseUrl ? describe : describe.skip;
const currentDir = dirname(fileURLToPath(import.meta.url));
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
type SnapshotFleet = {
  id: string;
  mission: string;
  status: string;
};

describeIfPostgres("Aquata API integration", () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.DATABASE_URL = testDatabaseUrl;
    process.env.NODE_ENV = "test";

    await resetDatabase(testDatabaseUrl!);
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({
        forbidNonWhitelisted: true,
        transform: true,
        whitelist: true,
      }),
    );
    await app.init();
  });

  beforeEach(async () => {
    await resetDatabase(testDatabaseUrl!);
    await seedRoundAndDummy(testDatabaseUrl!);
  });

  afterAll(async () => {
    await app.close();
  });

  it("registers, logs in, returns me, and logs out", async () => {
    const register = await request(app.getHttpServer())
      .post("/auth/register")
      .send({ email: "one@example.com", password: "password123", username: "one" })
      .expect(201);
    const registerCookie = sessionCookie(register);

    await request(app.getHttpServer()).get("/auth/me").set("Cookie", registerCookie).expect(200);

    const login = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ login: "one@example.com", password: "password123" })
      .expect(201);
    const cookie = sessionCookie(login);

    await request(app.getHttpServer()).get("/auth/me").set("Cookie", cookie).expect(200);
    await request(app.getHttpServer()).post("/auth/logout").set("Cookie", cookie).expect(201);
    await request(app.getHttpServer()).get("/auth/me").set("Cookie", cookie).expect(401);
  });

  it("bootstraps a player station on first game request", async () => {
    const cookie = await registerAndLogin("station");

    const response = await request(app.getHttpServer())
      .get("/game/me")
      .set("Cookie", cookie)
      .expect(200);

    expect(response.body.station.resources).toEqual({ aluminium: 500, energy: 300, steel: 400 });
    expect(response.body.station.ships.piranha).toBe(4);
    expect(response.body.targets).toHaveLength(1);
  });

  it("starts build and completes it on a dev tick", async () => {
    const cookie = await registerAndLogin("builder");
    await request(app.getHttpServer()).get("/game/me").set("Cookie", cookie).expect(200);

    await request(app.getHttpServer())
      .post("/build-orders")
      .set("Cookie", cookie)
      .send({ buildableId: "piranha", quantity: 1 })
      .expect(201);
    await request(app.getHttpServer()).post("/dev/tick").send({ tickNumber: 1 }).expect(201);

    const response = await request(app.getHttpServer())
      .get("/game/me")
      .set("Cookie", cookie)
      .expect(200);
    expect(response.body.station.ships.piranha).toBe(5);
    expect(response.body.station.buildQueue).toHaveLength(0);
  });

  it("starts research and completes it after its duration", async () => {
    const cookie = await registerAndLogin("researcher");
    await request(app.getHttpServer()).get("/game/me").set("Cookie", cookie).expect(200);

    await request(app.getHttpServer())
      .post("/research")
      .set("Cookie", cookie)
      .send({ researchId: "shipbuilding" })
      .expect(201);
    await request(app.getHttpServer()).post("/dev/tick").send({ tickNumber: 1 }).expect(201);
    await request(app.getHttpServer()).post("/dev/tick").send({ tickNumber: 2 }).expect(201);

    const response = await request(app.getHttpServer())
      .get("/game/me")
      .set("Cookie", cookie)
      .expect(200);
    expect(response.body.station.research.completed).toContain("shipbuilding");
  });

  it("sends a fleet and creates a combat report when it arrives", async () => {
    const cookie = await registerAndLogin("fleet");
    const snapshot = await request(app.getHttpServer())
      .get("/game/me")
      .set("Cookie", cookie)
      .expect(200);
    const targetStationId = snapshot.body.targets[0].id;
    expect(snapshot.body.activeFleets).toHaveLength(0);
    expect(snapshot.body.recentCombatReports).toHaveLength(0);
    expect(snapshot.body.catalog.buildables.piranha.cost).toEqual({
      aluminium: 75,
      energy: 0,
      steel: 0,
    });

    await request(app.getHttpServer())
      .post("/fleets")
      .set("Cookie", cookie)
      .send({ mission: "attack", ships: { piranha: 1 }, stationTicks: 1, targetStationId })
      .expect(201);

    const moving = await request(app.getHttpServer())
      .get("/game/me")
      .set("Cookie", cookie)
      .expect(200);
    expect(moving.body.activeFleets).toHaveLength(1);
    expect(moving.body.station.ships.piranha).toBe(3);

    for (const tickNumber of [1, 2, 3, 4]) {
      await request(app.getHttpServer()).post("/dev/tick").send({ tickNumber }).expect(201);
    }

    const reports = await request(app.getHttpServer())
      .get("/game/me")
      .set("Cookie", cookie)
      .expect(200);
    expect(reports.body.recentCombatReports).toHaveLength(1);
    expect(reports.body.recentCombatReports[0].report.outcome).toBe("defender_wins");
  });

  it("creates a station scan report and charges energy", async () => {
    const cookie = await registerAndLogin("scanner");
    const snapshot = await request(app.getHttpServer())
      .get("/game/me")
      .set("Cookie", cookie)
      .expect(200);

    await request(app.getHttpServer())
      .post("/scans")
      .set("Cookie", cookie)
      .send({ targetStationId: snapshot.body.targets[0].id })
      .expect(201);

    const afterScan = await request(app.getHttpServer())
      .get("/game/me")
      .set("Cookie", cookie)
      .expect(200);
    expect(afterScan.body.station.resources.energy).toBe(250);
    expect(afterScan.body.recentScanReports).toHaveLength(1);
    expect(afterScan.body.recentScanReports[0].report.result.ships.piranha).toBe(2);
  });

  it("includes defense fleets in combat reports", async () => {
    const defenderCookie = await registerAndLogin("defender");
    const attackerCookie = await registerAndLogin("attacker");
    const defenderSnapshot = await request(app.getHttpServer())
      .get("/game/me")
      .set("Cookie", defenderCookie)
      .expect(200);
    const attackerSnapshot = await request(app.getHttpServer())
      .get("/game/me")
      .set("Cookie", attackerCookie)
      .expect(200);
    const targetStationId = attackerSnapshot.body.targets[0].id;

    await request(app.getHttpServer())
      .post("/fleets")
      .set("Cookie", defenderCookie)
      .send({ mission: "defend", ships: { hai: 1 }, stationTicks: 6, targetStationId })
      .expect(201);
    expect(defenderSnapshot.body.station.ships.hai).toBe(1);

    await request(app.getHttpServer())
      .post("/fleets")
      .set("Cookie", attackerCookie)
      .send({ mission: "attack", ships: { piranha: 3 }, stationTicks: 1, targetStationId })
      .expect(201);

    for (const tickNumber of [1, 2, 3, 4]) {
      await request(app.getHttpServer()).post("/dev/tick").send({ tickNumber }).expect(201);
    }

    const reports = await request(app.getHttpServer())
      .get("/game/me")
      .set("Cookie", attackerCookie)
      .expect(200);
    expect(reports.body.recentCombatReports[0].report.participants).toEqual(
      expect.arrayContaining([expect.objectContaining({ role: "defender", source: "fleet" })]),
    );
  });

  it("recalls fleets in transit and while stationed", async () => {
    const cookie = await registerAndLogin("recaller");
    const snapshot = await request(app.getHttpServer())
      .get("/game/me")
      .set("Cookie", cookie)
      .expect(200);
    const targetStationId = snapshot.body.targets[0].id;

    await request(app.getHttpServer())
      .post("/fleets")
      .set("Cookie", cookie)
      .send({ mission: "attack", ships: { piranha: 1 }, stationTicks: 2, targetStationId })
      .expect(201);
    const inTransit = await request(app.getHttpServer()).get("/game/me").set("Cookie", cookie);
    await request(app.getHttpServer())
      .post(`/fleets/${inTransit.body.activeFleets[0].id}/recall`)
      .set("Cookie", cookie)
      .expect(201);
    const returning = await request(app.getHttpServer())
      .get("/game/me")
      .set("Cookie", cookie)
      .expect(200);
    expect(returning.body.activeFleets[0].status).toBe("returning");

    await request(app.getHttpServer())
      .post("/fleets")
      .set("Cookie", cookie)
      .send({ mission: "defend", ships: { qualle: 1 }, stationTicks: 6, targetStationId })
      .expect(201);
    for (const tickNumber of [1, 2, 3, 4]) {
      await request(app.getHttpServer())
        .post("/dev/tick")
        .send({ tickNumber: tickNumber + 10 })
        .expect(201);
    }
    const stationed = await request(app.getHttpServer()).get("/game/me").set("Cookie", cookie);
    const activeFleets = stationed.body.activeFleets as SnapshotFleet[];
    const stationedFleet = activeFleets.find(
      (fleet) => fleet.status === "stationed" && fleet.mission === "defend",
    );
    if (!stationedFleet) {
      throw new Error("Expected stationed defense fleet");
    }
    await request(app.getHttpServer())
      .post(`/fleets/${stationedFleet.id}/recall`)
      .set("Cookie", cookie)
      .expect(201);
  });

  it("does not apply the same tick twice", async () => {
    const cookie = await registerAndLogin("idempotent");
    await request(app.getHttpServer()).get("/game/me").set("Cookie", cookie).expect(200);

    const first = await request(app.getHttpServer())
      .post("/dev/tick")
      .send({ tickNumber: 1 })
      .expect(201);
    const second = await request(app.getHttpServer())
      .post("/dev/tick")
      .send({ tickNumber: 1 })
      .expect(201);

    expect(first.body.applied).toBe(true);
    expect(second.body.applied).toBe(false);
  });

  async function registerAndLogin(username: string): Promise<string> {
    const register = await request(app.getHttpServer())
      .post("/auth/register")
      .send({ email: `${username}@example.com`, password: "password123", username })
      .expect(201);
    return sessionCookie(register);
  }
});

function sessionCookie(response: request.Response): string {
  const cookie = response.headers["set-cookie"];
  if (!Array.isArray(cookie) || cookie.length === 0) {
    throw new Error("Expected session cookie");
  }
  return cookie[0]!;
}

async function resetDatabase(databaseUrl: string): Promise<void> {
  const pool = new pg.Pool({ connectionString: databaseUrl });
  try {
    await pool.query("drop schema if exists public cascade");
    await pool.query("create schema public");
    for (const migrationName of await migrationNames()) {
      const migration = await readFile(
        resolve(currentDir, `../../../packages/db/drizzle/${migrationName}`),
        "utf8",
      );
      for (const statement of migration.split("--> statement-breakpoint")) {
        if (statement.trim()) {
          await pool.query(statement);
        }
      }
    }
  } finally {
    await pool.end();
  }
}

async function seedRoundAndDummy(databaseUrl: string): Promise<void> {
  const db = createDbClient(databaseUrl);
  try {
    const [round] = await db.db
      .insert(rounds)
      .values({ name: "Test Round", status: "active", tickLengthMinutes: 30 })
      .returning();
    if (!round) {
      throw new Error("Could not seed round");
    }

    const [dummyPlayer] = await db.db
      .insert(players)
      .values({ displayName: "Dummy Opponent", isDummy: true, roundId: round.id })
      .returning();
    if (!dummyPlayer) {
      throw new Error("Could not seed dummy player");
    }

    const [dummyStation] = await db.db
      .insert(stations)
      .values({
        name: "Dummy Reef",
        playerId: dummyPlayer.id,
        production: [],
        resources: { aluminium: 100, energy: 100, steel: 100 },
        roundId: round.id,
        x: 10,
        y: 0,
      })
      .returning();
    if (!dummyStation) {
      throw new Error("Could not seed dummy station");
    }

    await db.db.insert(stationShips).values({
      ships: { ...emptyShips, piranha: 2, qualle: 1 },
      stationId: dummyStation.id,
    });
    await db.db.insert(researchStates).values({
      state: { completed: [] },
      stationId: dummyStation.id,
    });
  } finally {
    await db.pool.end();
  }
}

async function migrationNames(): Promise<string[]> {
  const names = await readdir(resolve(currentDir, "../../../packages/db/drizzle"));
  return names.filter((name) => name.endsWith(".sql") && name !== "0000_phase_2_mvp.sql").sort();
}
