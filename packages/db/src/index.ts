import { PrismaClient } from "@prisma/client";

export const prismaSchemaPath = "packages/db/prisma/schema.prisma";

export type DatabaseConnectionClient = {
  $connect: () => Promise<void>;
  $queryRawUnsafe: (query: string) => Promise<unknown>;
};

export type DatabaseDisconnectClient = {
  $disconnect: () => Promise<void>;
};

export const createPrismaClient = (databaseUrl = process.env.DATABASE_URL): PrismaClient =>
  new PrismaClient(
    databaseUrl
      ? {
          datasources: {
            db: {
              url: databaseUrl
            }
          }
        }
      : undefined
  );

export const checkDatabaseConnection = async (client: DatabaseConnectionClient): Promise<unknown> => {
  await client.$connect();
  return client.$queryRawUnsafe("SELECT 1 AS ok");
};

export const disconnectPrisma = async (client: DatabaseDisconnectClient): Promise<void> => {
  await client.$disconnect();
};
