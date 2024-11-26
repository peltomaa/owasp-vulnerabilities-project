import { test, expect } from "@playwright/test";

test.describe("Server-Side Request Forgery (SSRF)", () => {
  test("SHOULD be able to call api via /api/image endpoint", async ({
    page,
  }) => {
    const ssrfApiUrl = "http://localhost:3000/api/image";

    const response = await page.request.get(ssrfApiUrl, {
      params: { url: "https://jsonplaceholder.typicode.com/todos/1" },
    });

    expect(response.status()).toBe(200);

    const responseData = await response.json();

    expect(responseData).toEqual({
      userId: 1,
      id: 1,
      title: "delectus aut autem",
      completed: false,
    });
  });
});
