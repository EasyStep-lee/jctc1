import { describe, expect, it } from "vitest";
import { AppModule } from "../src/app.module.js";

describe("api scaffold", () => {
  it("exports a Nest module", () => {
    expect(AppModule).toBeDefined();
  });
});
