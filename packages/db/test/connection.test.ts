import { describe, expect, it } from "vitest";
import { checkDatabaseConnection, createPrismaClient, disconnectPrisma } from "../src/index.js";

describe("database connection helpers", () => {
  it("creates a Prisma client with the provided datasource URL", () => {
    const client = createPrismaClient("mysql://user:pass@127.0.0.1:3306/jctc_local");

    expect(client).toBeDefined();
    expect(typeof client.$connect).toBe("function");
  });

  it("checks database connectivity with a lightweight query", async () => {
    const calls: string[] = [];
    const client = {
      $connect: async () => {
        calls.push("connect");
      },
      $queryRawUnsafe: async (query: string) => {
        calls.push(query);
        return [{ ok: 1 }];
      }
    };

    await expect(checkDatabaseConnection(client)).resolves.toEqual([{ ok: 1 }]);
    expect(calls).toEqual(["connect", "SELECT 1 AS ok"]);
  });

  it("disconnects Prisma clients", async () => {
    let disconnected = false;
    const client = {
      $disconnect: async () => {
        disconnected = true;
      }
    };

    await disconnectPrisma(client);

    expect(disconnected).toBe(true);
  });
});
