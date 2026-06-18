import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const openApiPath = resolve("../../docs/openapi/openapi.yaml");

await access(openApiPath);
const content = await readFile(openApiPath, "utf8");

if (!content.includes("openapi: 3.1.0")) {
  throw new Error("OpenAPI scaffold must use version 3.1.0");
}
