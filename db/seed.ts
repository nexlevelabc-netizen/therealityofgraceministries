import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { events } from "./schema";
import { buildEventSeeds } from "./seed-data";

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
  const db = drizzle(pool);
  await db.delete(events);
  await db.insert(events).values(buildEventSeeds());
  console.log("seeded events");
  await pool.end();
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
