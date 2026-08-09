import { defineConfig, devices } from "@playwright/test"

/**
 * E2E — ADR 0011. Single seam, against the real UI. `E2E_TEST_MODE=true`
 * in the webServer guarantees the email DAL (lib/data/email.ts) runs in
 * dry-run — no test fires a real email through Resend.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    env: {
      E2E_TEST_MODE: "true",
    },
  },
})
