import { expect, test } from "@playwright/test";

test("login page offers Google sign-in only", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { level: 1, name: "split-expense" })).toBeVisible();
  const google = page.getByRole("button", { name: "Continue with Google" });
  await expect(google).toBeVisible();
  const box = await google.boundingBox();
  expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
  await expect(page.getByLabel(/email/i)).toHaveCount(0);
});

test("signed-out visit to an app page redirects to login with next", async ({ page }) => {
  await page.goto("/groups");
  await expect(page).toHaveURL(/\/login\?next=%2Fgroups$/);
});

test("login shows a readable error after a failed callback", async ({ page }) => {
  await page.goto("/auth/callback?error=access_denied");
  await expect(page).toHaveURL(/\/login\?error=/);
  // Next.js renders its own empty role="alert" route announcer, so match ours by text.
  await expect(page.getByRole("alert").filter({ hasText: "Sign-in was cancelled" })).toBeVisible();
});
