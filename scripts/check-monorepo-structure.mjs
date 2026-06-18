import { existsSync } from "node:fs";
import { resolve } from "node:path";

const requiredPaths = [
  "apps/api",
  "apps/admin-web",
  "apps/merchant-web",
  "apps/portal-web",
  "apps/user-miniapp",
  "apps/logistics-miniapp",
  "packages/config",
  "packages/db",
  "packages/openapi-client",
  "packages/shared",
  "packages/ui",
  "packages/miniapp-shared",
  "docs/p0",
  "docs/adr",
  "docs/field-dictionaries",
  "docs/openapi",
  "docs/test-reports",
  "package.json",
  "pnpm-workspace.yaml",
  "turbo.json"
];

const missingPaths = requiredPaths.filter((path) => !existsSync(resolve(path)));

if (missingPaths.length > 0) {
  console.error(`Missing monorepo paths:\n${missingPaths.join("\n")}`);
  process.exit(1);
}

console.log("Monorepo structure check passed.");
