import { test, expect } from "@playwright/test";

test.describe("A01:2021 – Broken access control", () => {
  test("SHOULD should be able to access admin page and remove users", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000/login");

    await page.fill('input[name="username"]', "user");
    await page.fill('input[name="password"]', "user123");
    await page.click('input[type="submit"]');

    await page.goto("http://localhost:3000/admin");

    const users = page.locator("ul > li");
    await expect(users).toHaveCount(2);
    await expect(users.nth(0)).toContainText("admin");
    await expect(users.nth(1)).toContainText("user");

    const firstItemButton = users.nth(0).locator("button");
    await firstItemButton.click();

    await expect(users).toHaveCount(1);
    await expect(users.nth(0)).toContainText("user");
  });
});
