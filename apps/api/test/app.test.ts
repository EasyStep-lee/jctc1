import { describe, expect, it } from "vitest";
import { AppModule } from "../src/app.module.js";
import { loadApiEnv } from "../src/env.js";

describe("api scaffold", () => {
  it("exports a Nest module", () => {
    expect(AppModule).toBeDefined();
  });

  it("validates required environment variables before startup", () => {
    expect(() => loadApiEnv({})).toThrow();
  });

  it("uses parsed environment values for startup configuration", () => {
    const env = loadApiEnv({
      DATABASE_URL: "mysql://user:pass@127.0.0.1:3306/jctc_local",
      REDIS_URL: "redis://127.0.0.1:6379",
      JWT_SECRET: "local-dev-secret",
      PORT: "3100"
    });

    expect(env.PORT).toBe(3100);
  });
});
