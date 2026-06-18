import { describe, expect, it } from "vitest";
import { envSchema } from "../src/env.js";

describe("env schema scaffold", () => {
  it("parses required local development variables", () => {
    const parsed = envSchema.parse({
      DATABASE_URL: "mysql://user:pass@127.0.0.1:3306/jctc_local",
      REDIS_URL: "redis://127.0.0.1:6379",
      JWT_SECRET: "local-dev-secret"
    });

    expect(parsed.NODE_ENV).toBe("local");
  });
});
