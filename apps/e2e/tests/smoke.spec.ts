import { expect, test } from "@playwright/test";

const apiUrl = process.env.API_URL ?? `http://127.0.0.1:${process.env.API_PORT ?? "3300"}`;

test("web starts and API healthcheck is reachable", async ({ page, request }) => {
  const health = await request.get(`${apiUrl}/health`);
  expect(health.ok()).toBe(true);
  const body: unknown = await health.json();
  expect(body).toMatchObject({
    service: "aquata-api",
    status: "ok",
  });

  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Kommandostation" })).toBeVisible();
  await expect(page.getByTestId("api-status")).toHaveText("ok");
});
