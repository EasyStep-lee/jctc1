import { parseEnv } from "@jctc/config";

export const loadApiEnv = (source: Record<string, unknown> = process.env) => parseEnv(source);
