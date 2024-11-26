import { test, expect } from "@playwright/test";

test.describe("A05:2021 – Security Misconfiguration", () => {
  test("SHOULD leak debug information", async ({ page }) => {
    const response = await page.request.get("http://localhost:3000/debug");

    expect(response.status()).toBe(200);

    const debugInfo = await response.json();

    expect(debugInfo).toHaveProperty("environment");
    expect(debugInfo).toHaveProperty("database");
    expect(debugInfo).toHaveProperty("debug", true);
    expect(debugInfo).toHaveProperty("activeRoutes");
    expect(debugInfo.database).toMatch("SQLite");

    console.log("Debug Info:", debugInfo);
  });
});
