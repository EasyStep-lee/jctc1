import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const prismaCli = require.resolve("prisma/build/index.js");
const env = {
  ...process.env,
  DATABASE_URL:
    process.env.DATABASE_URL ?? "mysql://jctc:local_password@127.0.0.1:3306/jctc_local"
};

const result = spawnSync(process.execPath, [prismaCli, ...process.argv.slice(2)], {
  stdio: "inherit",
  env
});

process.exit(result.status ?? 1);
