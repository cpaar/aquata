import { expect, test, type Page } from "@playwright/test";
import {
  createDbClient,
  players,
  researchStates,
  rounds,
  stationShips,
  stations,
} from "@aquata/db";
import pg from "pg";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const apiUrl = process.env.API_URL ?? `http://127.0.0.1:${process.env.API_PORT ?? "3300"}`;
const databaseUrl =
  process.env.TEST_DATABASE_URL ??
  process.env.DATABASE_URL ??
  "postgres://aquata:aquata@localhost:55432/aquata";
const currentDir = dirname(fileURLToPath(import.meta.url));

test.beforeEach(async () => {
  await resetDatabase(databaseUrl);
  await seedRoundAndDummy(databaseUrl);
});

test("plays the MVP flow from registration to combat report", async ({ page, request }) => {
  const health = await request.get(`${apiUrl}/health`);
  expect(health.ok()).toBe(true);

  const username = `pilot${Date.now()}`;
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await page.getByLabel("Username").fill(username);
  await page.getByLabel("E-Mail").fill(`${username}@example.com`);
  await page.getByLabel("Passwort").fill("password123");
  await page.getByRole("button", { name: "Station starten" }).click();

  await expect(page.getByRole("heading", { name: /Station bei/ })).toBeVisible();
  await expect(page.getByTestId("ship-interceptor")).toHaveText("2");
  expect(await hasHorizontalOverflow(page)).toBe(false);

  await page.getByRole("link", { name: "Bau" }).click();
  await page.getByRole("button", { name: "Bauen" }).first().click();
  await page.getByRole("button", { name: "Dev-Tick" }).click();
  await expect(page.getByText("Keine Auftraege")).toBeVisible();

  await page.getByRole("link", { name: "Dashboard" }).click();
  await expect(page.getByTestId("ship-interceptor")).toHaveText("3");

  await page.getByRole("link", { name: "Forschung" }).click();
  await page.getByRole("button", { name: "Starten" }).first().click();
  await page.getByRole("button", { name: "Dev-Tick" }).click();
  await page.getByRole("button", { name: "Dev-Tick" }).click();
  await expect(page.getByText("Status: abgeschlossen")).toBeVisible();

  await page.getByRole("link", { name: "Flotten" }).click();
  await page.getByRole("button", { name: "Flotte senden" }).click();
  await expect(page.getByText(/attack nach/)).toBeVisible();

  for (let tick = 0; tick < 4; tick += 1) {
    await page.getByRole("button", { name: "Dev-Tick" }).click();
  }

  await page.getByRole("link", { name: "Berichte" }).click();
  await expect(page.getByTestId("combat-outcome")).toHaveText("defender_wins");

  await page.getByRole("button", { name: "Logout" }).click();
  await expect(page.getByRole("heading", { name: "Neue Station" })).toBeVisible();
});

async function hasHorizontalOverflow(page: Page): Promise<boolean> {
  return page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
}

async function resetDatabase(url: string): Promise<void> {
  const pool = new pg.Pool({ connectionString: url });
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

async function seedRoundAndDummy(url: string): Promise<void> {
  const db = createDbClient(url);
  try {
    const [round] = await db.db
      .insert(rounds)
      .values({ name: "E2E Round", status: "active", tickLengthMinutes: 30 })
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
