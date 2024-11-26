import { test, expect } from "@playwright/test";

test.describe("A03:2021 – Injection", () => {
  test("SHOULD inject alert into page", async ({ page }) => {
    await page.goto("http://localhost:3000/login");

    const maliciousScript = `<script>alert('XSS')</script>`;
    await page.goto(
      `http://localhost:3000/login?error=${encodeURIComponent(maliciousScript)}`,
    );

    page.on("dialog", (dialog) => {
      expect(dialog.message()).toBe("XSS");
    });
  });
});
