import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3100",
    trace: "on-first-retry",
  },
  webServer: {
    command:
      "rm -f prisma/e2e-test.db && DATABASE_URL='file:./e2e-test.db' npx prisma migrate deploy && DATABASE_URL='file:./e2e-test.db' npx tsx prisma/seed.ts && DATABASE_URL='file:./e2e-test.db' npm run dev -- --port 3100",
    url: "http://localhost:3100",
    reuseExistingServer: false,
    timeout: 60_000,
  },
  projects: [
    {
      name: "chromium",
      use: {
        launchOptions: {
          executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || "/opt/pw-browsers/chromium",
        },
      },
    },
  ],
});
