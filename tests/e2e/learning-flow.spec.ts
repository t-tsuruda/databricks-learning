import { test, expect } from "@playwright/test";

// Covers docs/prd.md section 13's required E2E path:
// signup/login -> browse a course -> complete a lesson -> progress updates.
test("signup, complete a lesson, and see progress update", async ({ page }) => {
  const email = `e2e-${Date.now()}@example.com`;
  const password = "Passw0rd123";

  await page.goto("/signup");
  await page.fill("#displayName", "E2Eテストユーザー");
  await page.fill("#email", email);
  await page.fill("#password", password);
  await page.click('button[type="submit"]');

  await page.waitForURL("**/dashboard");
  await expect(page.getByRole("heading", { name: /さんのダッシュボード/ })).toBeVisible();
  await expect(page.getByText("全体の学習進捗")).toBeVisible();
  await expect(page.getByText("0%")).toBeVisible();

  await page.getByRole("link", { name: "コース一覧" }).click();
  await page.waitForURL("**/courses");
  await page.getByRole("link", { name: "データ入門とSQLの基礎" }).click();
  await page.waitForURL("**/courses/data-sql-basics");

  await page.getByRole("link", { name: "学習を始める" }).click();
  await page.waitForURL("**/lessons/what-is-data");

  await expect(page.getByRole("heading", { name: "データとは何か：表形式データの基本" })).toBeVisible();

  const quizOption = page.getByLabel("行（Row）");
  await quizOption.check();
  await page.getByRole("button", { name: "答え合わせをする" }).click();
  await expect(page.getByText("正解です")).toBeVisible();

  await page.getByRole("button", { name: "このレッスンを完了する" }).click();
  await page.waitForURL("**/lessons/sql-select-basics");

  await page.getByRole("link", { name: "進捗" }).click();
  await page.waitForURL("**/progress");
  await expect(page.getByText("1 / 12")).toBeVisible();
});

test("signup requires matching validation and login rejects wrong password", async ({ page }) => {
  await page.goto("/signup");
  await page.fill("#displayName", "バリデーションテスト");
  await page.fill("#email", "not-an-email");
  await page.fill("#password", "short");
  await page.click('button[type="submit"]');

  await expect(page.getByText("メールアドレスの形式が正しくありません")).toBeVisible();

  await page.goto("/login");
  await page.fill("#email", "nonexistent@example.com");
  await page.fill("#password", "WrongPassword123");
  await page.click('button[type="submit"]');

  await expect(page.getByText("メールアドレスまたはパスワードが正しくありません。")).toBeVisible();
});
