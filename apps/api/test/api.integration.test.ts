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
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { AppModule } from "../src/app.module.js";

const testDatabaseUrl = process.env.TEST_DATABASE_URL;
const describeIfPostgres = testDatabaseUrl ? describe : describe.skip;
const currentDir = dirname(fileURLToPath(import.meta.url));

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
    expect(response.body.station.ships.interceptor).toBe(2);
    expect(response.body.targets).toHaveLength(1);
  });

  it("starts build and completes it on a dev tick", async () => {
    const cookie = await registerAndLogin("builder");
    await request(app.getHttpServer()).get("/game/me").set("Cookie", cookie).expect(200);

    await request(app.getHttpServer())
      .post("/build-orders")
      .set("Cookie", cookie)
      .send({ buildableId: "interceptor", quantity: 1 })
      .expect(201);
    await request(app.getHttpServer()).post("/dev/tick").send({ tickNumber: 1 }).expect(201);

    const response = await request(app.getHttpServer())
      .get("/game/me")
      .set("Cookie", cookie)
      .expect(200);
    expect(response.body.station.ships.interceptor).toBe(3);
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
    expect(snapshot.body.catalog.buildables.interceptor.cost).toEqual({
      aluminium: 45,
      energy: 25,
      steel: 25,
    });

    await request(app.getHttpServer())
      .post("/fleets")
      .set("Cookie", cookie)
      .send({ ships: { interceptor: 1 }, targetStationId })
      .expect(201);

    const moving = await request(app.getHttpServer())
      .get("/game/me")
      .set("Cookie", cookie)
      .expect(200);
    expect(moving.body.activeFleets).toHaveLength(1);
    expect(moving.body.station.ships.interceptor).toBe(1);

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
    const migration = await readFile(
      resolve(currentDir, "../../../packages/db/drizzle/0001_huge_darwin.sql"),
      "utf8",
    );
    for (const statement of migration.split("--> statement-breakpoint")) {
      if (statement.trim()) {
        await pool.query(statement);
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
      ships: { fighter: 0, frigate: 0, harvester: 0, interceptor: 1 },
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
