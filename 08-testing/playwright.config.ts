import { defineConfig, devices } from '@playwright/test';

// Playwright settings for the end-to-end tests in e2e/.
// Run them with:  npm run e2e        (or: npx playwright test)
// Watch them:     npm run e2e -- --ui
export default defineConfig({
  // Where the E2E tests live. (Vitest's ng test only looks in src/, so the two never mix.)
  testDir: './e2e',

  // Show a readable list of results in the terminal, plus an HTML report.
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    // page.goto('/') opens this address.
    baseURL: 'http://localhost:4208',
    // Record a trace (screenshots + steps) when a test fails and is retried.
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'edge',
      // Uses the Microsoft Edge already installed on Windows, so no extra
      // browser download is needed. To use Playwright's own Chromium instead,
      // run `npx playwright install chromium` and remove the `channel` line.
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
  ],

  // Start the Angular dev server before the tests, and stop it after.
  // If it's already running on this port, reuse it.
  webServer: {
    command: 'npm start -- --port 4208',
    url: 'http://localhost:4208',
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
