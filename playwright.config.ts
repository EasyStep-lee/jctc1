import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "docs/p0",
  timeout: 30_000,
  reporter: [["list"]]
});
