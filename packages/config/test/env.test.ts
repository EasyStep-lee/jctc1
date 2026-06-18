import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { envSchema, envVariableDefinitions, parseEnv } from "../src/env.js";

const baseEnv = {
  DATABASE_URL: "mysql://user:pass@127.0.0.1:3306/jctc_local",
  REDIS_URL: "redis://127.0.0.1:6379",
  JWT_SECRET: "local-dev-secret"
};

const completeExternalEnv = {
  WECHAT_USER_APP_ID: "wx_user_placeholder",
  WECHAT_LOGISTICS_APP_ID: "wx_logistics_placeholder",
  WECHAT_PAY_MCH_ID: "wechat-pay-mch-placeholder",
  WECHAT_PAY_CERT_SERIAL_NO: "wechat-pay-cert-serial-placeholder",
  WECHAT_PAY_PRIVATE_KEY_PATH: "/run/secrets/wechat-pay-private-key.pem",
  MAP_PROVIDER: "provider-placeholder",
  MAP_PROVIDER_KEY: "map-key-placeholder",
  SMS_PROVIDER: "provider-placeholder",
  SMS_PROVIDER_KEY: "sms-key-placeholder",
  OBJECT_STORAGE_PROVIDER: "s3-compatible",
  OBJECT_STORAGE_ENDPOINT: "https://object-storage.example.com",
  OBJECT_STORAGE_BUCKET: "jctc-private",
  OBJECT_STORAGE_ACCESS_KEY_ID: "object-storage-access-key-placeholder",
  OBJECT_STORAGE_SECRET: "object-storage-secret-placeholder",
  PRIVACY_NUMBER_PROVIDER: "provider-placeholder",
  PRIVACY_NUMBER_KEY: "privacy-number-key-placeholder"
};

const expectedEnvNames = [
  "NODE_ENV",
  "PORT",
  "DATABASE_URL",
  "REDIS_URL",
  "JWT_SECRET",
  "WECHAT_USER_APP_ID",
  "WECHAT_LOGISTICS_APP_ID",
  "WECHAT_PAY_MCH_ID",
  "WECHAT_PAY_CERT_SERIAL_NO",
  "WECHAT_PAY_PRIVATE_KEY_PATH",
  "MAP_PROVIDER",
  "MAP_PROVIDER_KEY",
  "SMS_PROVIDER",
  "SMS_PROVIDER_KEY",
  "OBJECT_STORAGE_PROVIDER",
  "OBJECT_STORAGE_ENDPOINT",
  "OBJECT_STORAGE_BUCKET",
  "OBJECT_STORAGE_ACCESS_KEY_ID",
  "OBJECT_STORAGE_SECRET",
  "PRIVACY_NUMBER_PROVIDER",
  "PRIVACY_NUMBER_KEY"
];

describe("env schema", () => {
  it("parses required local development variables", () => {
    const parsed = parseEnv(baseEnv);

    expect(parsed.NODE_ENV).toBe("local");
    expect(parsed.MAP_PROVIDER).toBe("mock");
    expect(parsed.SMS_PROVIDER).toBe("mock");
    expect(parsed.OBJECT_STORAGE_PROVIDER).toBe("mock");
    expect(parsed.PRIVACY_NUMBER_PROVIDER).toBe("mock");
  });

  it("rejects staging when external service credentials are missing", () => {
    const parsed = envSchema.safeParse({
      ...baseEnv,
      NODE_ENV: "staging"
    });

    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      const missingFields = parsed.error.issues.map((issue) => issue.path.join("."));

      expect(missingFields).toEqual(
        expect.arrayContaining([
          "WECHAT_USER_APP_ID",
          "WECHAT_LOGISTICS_APP_ID",
          "WECHAT_PAY_MCH_ID",
          "WECHAT_PAY_CERT_SERIAL_NO",
          "WECHAT_PAY_PRIVATE_KEY_PATH",
          "MAP_PROVIDER",
          "MAP_PROVIDER_KEY",
          "SMS_PROVIDER",
          "SMS_PROVIDER_KEY",
          "OBJECT_STORAGE_PROVIDER",
          "OBJECT_STORAGE_ENDPOINT",
          "OBJECT_STORAGE_BUCKET",
          "OBJECT_STORAGE_ACCESS_KEY_ID",
          "OBJECT_STORAGE_SECRET",
          "PRIVACY_NUMBER_PROVIDER",
          "PRIVACY_NUMBER_KEY"
        ])
      );
    }
  });

  it("parses production when all external service variables are provided", () => {
    const parsed = parseEnv({
      ...baseEnv,
      ...completeExternalEnv,
      NODE_ENV: "prod",
      PORT: "8080"
    });

    expect(parsed.NODE_ENV).toBe("prod");
    expect(parsed.PORT).toBe(8080);
    expect(parsed.OBJECT_STORAGE_PROVIDER).toBe("s3-compatible");
  });

  it("documents every schema variable with requirement and example metadata", () => {
    expect(envVariableDefinitions.map((definition) => definition.name)).toEqual(expectedEnvNames);
    expect(
      envVariableDefinitions.every(
        (definition) =>
          definition.description.length > 0 &&
          definition.example.length > 0 &&
          definition.requiredIn.length > 0 &&
          definition.secretLevel.length > 0 &&
          definition.source.length > 0
      )
    ).toBe(true);
  });

  it(".env.example stays aligned with the env schema variables", () => {
    const envExample = readFileSync(resolve(import.meta.dirname, "../../../.env.example"), "utf8");
    const envExampleNames = envExample
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.startsWith("#"))
      .map((line) => line.split("=")[0]);

    expect(envExampleNames).toEqual(expectedEnvNames);
  });
});
