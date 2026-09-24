import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { defineConfig, devices } from '@playwright/test';

// Next.js auto-loads .env.local for the dev server it spawns below, but the
// Playwright test runner is a separate Node process that doesn't — without
// this, e2e specs gating on NEXT_PUBLIC_SUPABASE_URL always see it as unset
// and skip themselves even when a real project is configured.
const envLocalPath = path.resolve(__dirname, '.env.local');
if (existsSync(envLocalPath)) {
  for (const line of readFileSync(envLocalPath, 'utf-8').split('\n')) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
  }
}

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
