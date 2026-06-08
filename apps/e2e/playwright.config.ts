import { defineConfig, devices } from "@playwright/test";

const apiPort = process.env.API_PORT ?? "3300";
const webPort = process.env.WEB_PORT ?? "5174";
const apiUrl = process.env.API_URL ?? `http://127.0.0.1:${apiPort}`;
const webUrl = process.env.WEB_URL ?? `http://127.0.0.1:${webPort}`;

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL: webUrl,
    trace: "on-first-retry",
  },
  webServer: [
    {
      command: `PORT=${apiPort} corepack pnpm --filter @aquata/api dev`,
      url: `${apiUrl}/health`,
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
    {
      command: `VITE_API_URL=${apiUrl} corepack pnpm --filter @aquata/web exec vite --host 0.0.0.0 --port ${webPort}`,
      url: webUrl,
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
  ],
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
