import { test, expect } from "@playwright/test";

test.describe("A04:2021 - Insecure Design", () => {
  test("SHOULD allow login with predictable token", async ({ page }) => {
    await page.goto("http://localhost:3000/login");

    const predictableUsername = "admin";

    const sessionToken = `${predictableUsername}-${Date.now()}`;
    await page.context().addCookies([
      {
        name: "session",
        value: sessionToken,
        domain: "localhost",
        path: "/",
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
      },
    ]);

    await page.goto("http://localhost:3000/home");

    const usernameElement = page.locator("p");
    await expect(usernameElement).toHaveText(
      `Welcome home ${predictableUsername}!`,
    );
  });
});
