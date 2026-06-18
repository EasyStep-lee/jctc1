import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.js";
import { loadApiEnv } from "./env.js";

const env = loadApiEnv();

const app = await NestFactory.create(AppModule);
await app.listen(env.PORT);
