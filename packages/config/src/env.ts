import { z } from "zod";

const stageEnvironments = ["staging", "prod"] as const;

type StageEnvironment = (typeof stageEnvironments)[number];

export type EnvVariableDefinition = {
  name: keyof AppEnv;
  description: string;
  requiredIn: Array<AppEnv["NODE_ENV"] | "all">;
  example: string;
  secretLevel: "none" | "medium" | "high" | "critical";
  source: string;
};

const optionalText = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().trim().min(1).optional()
);

const providerText = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().trim().min(1).default("mock")
);

export const envSchema = z.object({
  NODE_ENV: z.enum(["local", "dev", "test", "staging", "prod"]).default("local"),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  WECHAT_USER_APP_ID: optionalText,
  WECHAT_LOGISTICS_APP_ID: optionalText,
  WECHAT_PAY_MCH_ID: optionalText,
  WECHAT_PAY_CERT_SERIAL_NO: optionalText,
  WECHAT_PAY_PRIVATE_KEY_PATH: optionalText,
  MAP_PROVIDER: providerText,
  MAP_PROVIDER_KEY: optionalText,
  SMS_PROVIDER: providerText,
  SMS_PROVIDER_KEY: optionalText,
  OBJECT_STORAGE_PROVIDER: providerText,
  OBJECT_STORAGE_ENDPOINT: optionalText,
  OBJECT_STORAGE_BUCKET: optionalText,
  OBJECT_STORAGE_ACCESS_KEY_ID: optionalText,
  OBJECT_STORAGE_SECRET: optionalText,
  PRIVACY_NUMBER_PROVIDER: providerText,
  PRIVACY_NUMBER_KEY: optionalText
}).superRefine((env, context) => {
  const requireWhenStage = (field: keyof AppEnv) => {
    if (stageEnvironments.includes(env.NODE_ENV as StageEnvironment) && env[field] === undefined) {
      context.addIssue({
        code: "custom",
        path: [field],
        message: `${String(field)} is required in ${env.NODE_ENV}`
      });
    }
  };

  const requireNonMockProviderWhenStage = (providerField: keyof AppEnv, keyField: keyof AppEnv) => {
    if (!stageEnvironments.includes(env.NODE_ENV as StageEnvironment)) {
      return;
    }

    if (env[providerField] === "mock") {
      context.addIssue({
        code: "custom",
        path: [providerField],
        message: `${String(providerField)} must use a real provider in ${env.NODE_ENV}`
      });
    }

    requireWhenStage(keyField);
  };

  [
    "WECHAT_USER_APP_ID",
    "WECHAT_LOGISTICS_APP_ID",
    "WECHAT_PAY_MCH_ID",
    "WECHAT_PAY_CERT_SERIAL_NO",
    "WECHAT_PAY_PRIVATE_KEY_PATH",
    "OBJECT_STORAGE_ENDPOINT",
    "OBJECT_STORAGE_BUCKET",
    "OBJECT_STORAGE_ACCESS_KEY_ID",
    "OBJECT_STORAGE_SECRET"
  ].forEach((field) => requireWhenStage(field as keyof AppEnv));

  requireNonMockProviderWhenStage("MAP_PROVIDER", "MAP_PROVIDER_KEY");
  requireNonMockProviderWhenStage("SMS_PROVIDER", "SMS_PROVIDER_KEY");
  requireNonMockProviderWhenStage("OBJECT_STORAGE_PROVIDER", "OBJECT_STORAGE_SECRET");
  requireNonMockProviderWhenStage("PRIVACY_NUMBER_PROVIDER", "PRIVACY_NUMBER_KEY");
});

export type AppEnv = z.infer<typeof envSchema>;

export const envVariableDefinitions: EnvVariableDefinition[] = [
  {
    name: "NODE_ENV",
    description: "Runtime environment name.",
    requiredIn: ["all"],
    example: "local",
    secretLevel: "none",
    source: "deployment runtime"
  },
  {
    name: "PORT",
    description: "HTTP listen port.",
    requiredIn: ["all"],
    example: "3000",
    secretLevel: "none",
    source: "deployment runtime"
  },
  {
    name: "DATABASE_URL",
    description: "MySQL connection string.",
    requiredIn: ["all"],
    example: "mysql://user:pass@host:3306/db",
    secretLevel: "high",
    source: "secret manager"
  },
  {
    name: "REDIS_URL",
    description: "Redis and BullMQ connection string.",
    requiredIn: ["all"],
    example: "redis://host:6379",
    secretLevel: "high",
    source: "secret manager"
  },
  {
    name: "JWT_SECRET",
    description: "Token signing secret.",
    requiredIn: ["all"],
    example: "replace-with-secret-manager-value",
    secretLevel: "critical",
    source: "secret manager"
  },
  {
    name: "WECHAT_USER_APP_ID",
    description: "User mini program AppID.",
    requiredIn: ["staging", "prod"],
    example: "wx_xxx",
    secretLevel: "medium",
    source: "WeChat public platform"
  },
  {
    name: "WECHAT_LOGISTICS_APP_ID",
    description: "Logistics mini program AppID.",
    requiredIn: ["staging", "prod"],
    example: "wx_xxx",
    secretLevel: "medium",
    source: "WeChat public platform"
  },
  {
    name: "WECHAT_PAY_MCH_ID",
    description: "WeChat Pay merchant ID.",
    requiredIn: ["staging", "prod"],
    example: "replace-with-wechat-pay-merchant-id",
    secretLevel: "high",
    source: "WeChat Pay platform"
  },
  {
    name: "WECHAT_PAY_CERT_SERIAL_NO",
    description: "WeChat Pay certificate serial number.",
    requiredIn: ["staging", "prod"],
    example: "replace-with-wechat-pay-cert-serial",
    secretLevel: "high",
    source: "WeChat Pay platform"
  },
  {
    name: "WECHAT_PAY_PRIVATE_KEY_PATH",
    description: "Filesystem path for the WeChat Pay private key.",
    requiredIn: ["staging", "prod"],
    example: "/run/secrets/wechat-pay-private-key.pem",
    secretLevel: "critical",
    source: "secret manager"
  },
  {
    name: "MAP_PROVIDER",
    description: "Map adapter provider.",
    requiredIn: ["all"],
    example: "mock",
    secretLevel: "none",
    source: "deployment runtime"
  },
  {
    name: "MAP_PROVIDER_KEY",
    description: "Map adapter credential.",
    requiredIn: ["staging", "prod"],
    example: "replace-with-map-provider-key",
    secretLevel: "high",
    source: "map provider"
  },
  {
    name: "SMS_PROVIDER",
    description: "SMS adapter provider.",
    requiredIn: ["all"],
    example: "mock",
    secretLevel: "none",
    source: "deployment runtime"
  },
  {
    name: "SMS_PROVIDER_KEY",
    description: "SMS adapter credential.",
    requiredIn: ["staging", "prod"],
    example: "replace-with-sms-provider-key",
    secretLevel: "high",
    source: "SMS provider"
  },
  {
    name: "OBJECT_STORAGE_PROVIDER",
    description: "Object storage adapter provider.",
    requiredIn: ["all"],
    example: "mock",
    secretLevel: "none",
    source: "deployment runtime"
  },
  {
    name: "OBJECT_STORAGE_ENDPOINT",
    description: "Object storage endpoint.",
    requiredIn: ["staging", "prod"],
    example: "https://object-storage.example.com",
    secretLevel: "high",
    source: "object storage provider"
  },
  {
    name: "OBJECT_STORAGE_BUCKET",
    description: "Object storage bucket.",
    requiredIn: ["staging", "prod"],
    example: "jctc-private",
    secretLevel: "medium",
    source: "object storage provider"
  },
  {
    name: "OBJECT_STORAGE_ACCESS_KEY_ID",
    description: "Object storage access key ID.",
    requiredIn: ["staging", "prod"],
    example: "replace-with-object-storage-access-key-id",
    secretLevel: "high",
    source: "object storage provider"
  },
  {
    name: "OBJECT_STORAGE_SECRET",
    description: "Object storage access secret.",
    requiredIn: ["staging", "prod"],
    example: "replace-with-object-storage-secret",
    secretLevel: "high",
    source: "object storage provider"
  },
  {
    name: "PRIVACY_NUMBER_PROVIDER",
    description: "Privacy number adapter provider.",
    requiredIn: ["all"],
    example: "mock",
    secretLevel: "none",
    source: "deployment runtime"
  },
  {
    name: "PRIVACY_NUMBER_KEY",
    description: "Privacy number adapter credential.",
    requiredIn: ["staging", "prod"],
    example: "replace-with-privacy-number-key",
    secretLevel: "high",
    source: "privacy number provider"
  }
];

export const parseEnv = (source: Record<string, unknown>): AppEnv => envSchema.parse(source);
