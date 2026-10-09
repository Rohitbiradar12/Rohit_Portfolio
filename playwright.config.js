import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/browser", timeout: 45000, expect: { timeout: 10000 }, workers: 1,
  use: { baseURL: "http://127.0.0.1:5173", channel: "chrome", headless: true, reducedMotion: "reduce", screenshot: "only-on-failure" },
  webServer: [
    { command: "npm run dev -- --host 127.0.0.1", url: "http://127.0.0.1:5173", reuseExistingServer: true },
    { command: "npm run dev:api", url: "http://127.0.0.1:3001/health", reuseExistingServer: true },
  ],
});
