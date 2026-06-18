import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(".");
const exactVersionPattern = /^\d+\.\d+\.\d+$/;
const requiredNodeVersion = "25.8.1";
const requiredPnpmVersion = "10.12.1";
const packageJsonPaths = [
  "package.json",
  "apps/api/package.json",
  "apps/admin-web/package.json",
  "apps/merchant-web/package.json",
  "apps/portal-web/package.json",
  "apps/user-miniapp/package.json",
  "apps/logistics-miniapp/package.json",
  "packages/config/package.json",
  "packages/db/package.json",
  "packages/openapi-client/package.json",
  "packages/shared/package.json",
  "packages/ui/package.json",
  "packages/miniapp-shared/package.json"
];

function readJson(path) {
  return JSON.parse(readFileSync(join(root, path), "utf8"));
}

const failures = [];
const rootPackage = readJson("package.json");
const nvmrc = readFileSync(join(root, ".nvmrc"), "utf8").trim();

if (nvmrc !== requiredNodeVersion) {
  failures.push(`.nvmrc must be ${requiredNodeVersion}, found ${nvmrc}`);
}

if (rootPackage.packageManager !== `pnpm@${requiredPnpmVersion}`) {
  failures.push(`packageManager must be pnpm@${requiredPnpmVersion}`);
}

if (rootPackage.engines?.node !== requiredNodeVersion) {
  failures.push(`engines.node must be ${requiredNodeVersion}`);
}

if (rootPackage.engines?.pnpm !== requiredPnpmVersion) {
  failures.push(`engines.pnpm must be ${requiredPnpmVersion}`);
}

if (!existsSync(join(root, "pnpm-lock.yaml"))) {
  failures.push("pnpm-lock.yaml must exist");
}

for (const path of packageJsonPaths) {
  const packageJson = readJson(path);
  for (const section of ["dependencies", "devDependencies"]) {
    const dependencies = packageJson[section] ?? {};
    for (const [name, version] of Object.entries(dependencies)) {
      const isInternalWorkspaceDependency = name.startsWith("@jctc/") && version === "workspace:*";

      if (!exactVersionPattern.test(version) && !isInternalWorkspaceDependency) {
        failures.push(`${path} ${section}.${name} must be exact, found ${version}`);
      }
    }
  }
}

if (failures.length > 0) {
  console.error(`Version freeze check failed:\n${failures.join("\n")}`);
  process.exit(1);
}

console.log("Version freeze check passed.");
