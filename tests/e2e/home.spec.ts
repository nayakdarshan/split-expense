import { expect, test } from "@playwright/test";

test("home shows the split-expense brand and fits a 390px phone", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);

  await expect(page).toHaveTitle(/split-expense/);
  await expect(page.getByRole("heading", { level: 1, name: "split-expense" })).toBeVisible();

  // No horizontal scroll at phone width.
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
