import { PrismaClient } from "@prisma/client";

const databaseUrl =
  process.env.DATABASE_URL ?? "mysql://jctc:local_password@127.0.0.1:3306/jctc_local";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl
    }
  }
});

try {
  const result = await prisma.$queryRawUnsafe("SELECT 1 AS ok");
  process.stdout.write(
    `${JSON.stringify(result, (_key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )}\n`
  );
} finally {
  await prisma.$disconnect();
}
