import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import { events } from "./schema";
import { buildEventSeeds } from "./seed-data";

async function main() {
  const db = drizzle(process.env.DATABASE_URL!, { mode: "planetscale" });
  await db.delete(events);
  await db.insert(events).values(buildEventSeeds());
  console.log("seeded events");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
