import "dotenv/config";
import { defineConfig, env } from "prisma/config";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

const tursoUrl = env("TURSO_DATABASE_URL");

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  ...(tursoUrl
    ? {
        migrate: {
          adapter: async () =>
            new PrismaLibSQL({
              url: tursoUrl,
              authToken: env("TURSO_AUTH_TOKEN"),
            }),
        },
      }
    : {
        datasource: {
          url: env("DATABASE_URL"),
        },
      }),
});
