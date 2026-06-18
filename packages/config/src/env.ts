import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["local", "dev", "test", "staging", "prod"]).default("local"),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  WECHAT_USER_APP_ID: z.string().optional(),
  WECHAT_LOGISTICS_APP_ID: z.string().optional(),
  WECHAT_PAY_MCH_ID: z.string().optional(),
  MAP_PROVIDER: z.string().default("mock"),
  SMS_PROVIDER: z.string().default("mock"),
  OBJECT_STORAGE_PROVIDER: z.string().default("mock"),
  PRIVACY_NUMBER_PROVIDER: z.string().default("mock")
});

export type AppEnv = z.infer<typeof envSchema>;
