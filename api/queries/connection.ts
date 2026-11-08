import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "../lib/env";
import * as schema from "@db/schema";
import * as relations from "@db/relations";

const fullSchema = { ...schema, ...relations };

let instance: ReturnType<typeof drizzle<typeof fullSchema>>;

export function getDb() {
  if (!instance) {
    // Neon and other hosted Postgres providers require TLS; pg reads sslmode
    // from the connection string, but Neon URLs rely on this default.
    const pool = new Pool({
      connectionString: env.databaseUrl,
      ssl: env.databaseUrl.includes("localhost") ? false : { rejectUnauthorized: false },
    });
    instance = drizzle(pool, { schema: fullSchema });
  }
  return instance;
}
