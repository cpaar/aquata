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
import { readdir, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const apiUrl = process.env.API_URL ?? `http://127.0.0.1:${process.env.API_PORT ?? "3300"}`;
const databaseUrl =
  process.env.TEST_DATABASE_URL ??
  process.env.DATABASE_URL ??
  "postgres://aquata:aquata@localhost:55432/aquata";
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
  await expect(page.getByTestId("ship-piranha")).toHaveText("4");
  await expectNoHorizontalOverflow(page);

  await page.getByRole("link", { name: "Bau" }).click();
  await page.getByRole("button", { name: "Bauen" }).first().click();
  await page.getByRole("button", { name: "Dev-Tick" }).click();
  await expect(page.getByText("Keine Auftraege")).toBeVisible();

  await page.getByRole("link", { name: "Dashboard" }).click();
  await expect(page.getByTestId("ship-piranha")).toHaveText("5");

  await page.getByRole("link", { name: "Forschung" }).click();
  await page.getByRole("button", { name: "Starten" }).first().click();
  await page.getByRole("button", { name: "Dev-Tick" }).click();
  await page.getByRole("button", { name: "Dev-Tick" }).click();
  await expect(page.getByText("Status: abgeschlossen")).toBeVisible();

  await page.getByRole("link", { name: "Flotten" }).click();
  await page.getByRole("button", { name: "Flotte senden" }).click();
  await expect(page.getByText(/attack inTransit/)).toBeVisible();

  for (let tick = 0; tick < 4; tick += 1) {
    await page.getByRole("button", { name: "Dev-Tick" }).click();
  }

  await page.getByRole("link", { name: "Berichte" }).click();
  await expect(page.getByTestId("combat-outcome")).toHaveText("defender_wins");

  await page.getByRole("button", { name: "Logout" }).click();
  await expect(page.getByRole("heading", { name: "Neue Station" })).toBeVisible();
});

test("plays the Phase 4 scan defense attack and recall flow", async ({ browser }) => {
  const defenderPage = await browser.newPage();
  const attackerPage = await browser.newPage();
  await defenderPage.setViewportSize({ width: 390, height: 844 });
  await attackerPage.setViewportSize({ width: 390, height: 844 });

  await register(defenderPage, "defender-with-a-deliberately-long-name");
  await register(attackerPage, "attacker-with-a-deliberately-long-name");

  await attackerPage.getByRole("link", { name: "Flotten" }).click();
  await attackerPage.getByRole("button", { name: "Station scannen" }).click();
  await attackerPage.getByRole("link", { name: "Berichte" }).click();
  await expect(attackerPage.getByTestId("scan-report")).toBeVisible();

  await defenderPage.getByRole("link", { name: "Flotten" }).click();
  await defenderPage.getByRole("button", { name: "Verteidigung" }).click();
  await defenderPage.getByLabel("Stationierung").fill("6");
  await defenderPage.getByLabel(/Piranha/).fill("0");
  await defenderPage.getByLabel(/Hai/).fill("1");
  await defenderPage.getByRole("button", { name: "Flotte senden" }).click();
  await expect(defenderPage.getByText(/defend inTransit/)).toBeVisible();

  await attackerPage.getByRole("link", { name: "Flotten" }).click();
  await attackerPage.getByLabel(/Piranha/).fill("3");
  await attackerPage.getByRole("button", { name: "Flotte senden" }).click();

  for (let tick = 0; tick < 4; tick += 1) {
    await attackerPage.getByRole("button", { name: "Dev-Tick" }).click();
  }

  await attackerPage.getByRole("link", { name: "Berichte" }).click();
  await expect(attackerPage.getByText(/defender:fleet/)).toBeVisible();

  await defenderPage.getByRole("link", { name: "Flotten" }).click();
  await defenderPage.reload();
  await expect(defenderPage.getByText(/defend stationed/)).toBeVisible();
  await defenderPage.getByRole("button", { name: "Rueckruf" }).click();
  await expect(defenderPage.getByText(/returning/)).toBeVisible();

  await expectNoHorizontalOverflow(attackerPage);
  await defenderPage.close();
  await attackerPage.close();
});

async function register(page: Page, username: string): Promise<void> {
  await page.goto("/");
  await page.getByLabel("Username").fill(`${username}${Date.now()}`);
  await page.getByLabel("E-Mail").fill(`${username}${Date.now()}@example.com`);
  await page.getByLabel("Passwort").fill("password123");
  await page.getByRole("button", { name: "Station starten" }).click();
  await expect(page.getByRole("heading", { name: /Station bei/ })).toBeVisible();
}

async function expectNoHorizontalOverflow(page: Page): Promise<void> {
  const overflow = await page.evaluate(() => {
    const viewportWidth = document.documentElement.clientWidth;
    const offenders = Array.from(document.querySelectorAll<HTMLElement>("body *"))
      .map((element) => {
        const bounds = element.getBoundingClientRect();
        return {
          element: [
            element.tagName.toLowerCase(),
            element.id ? `#${element.id}` : "",
            typeof element.className === "string" && element.className
              ? `.${element.className.trim().replaceAll(/\s+/g, ".")}`
              : "",
          ].join(""),
          left: Math.round(bounds.left * 100) / 100,
          right: Math.round(bounds.right * 100) / 100,
        };
      })
      .filter(({ left, right }) => left < -0.5 || right > viewportWidth + 0.5)
      .slice(0, 8);

    return {
      offenders,
      scrollWidth: document.documentElement.scrollWidth,
      viewportWidth,
    };
  });

  expect(
    overflow.scrollWidth,
    `Horizontal overflow at ${overflow.viewportWidth}px: ${JSON.stringify(overflow.offenders)}`,
  ).toBeLessThanOrEqual(overflow.viewportWidth);
}

async function resetDatabase(url: string): Promise<void> {
  const pool = new pg.Pool({ connectionString: url });
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
