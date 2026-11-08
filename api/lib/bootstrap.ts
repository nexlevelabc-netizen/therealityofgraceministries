import { sql } from "drizzle-orm";
import { migrate } from "drizzle-orm/mysql2/migrator";
import path from "path";
import { getDb } from "../queries/connection";
import { events } from "@db/schema";
import { buildEventSeeds } from "../../db/seed-data";
import { log } from "./logger";

/**
 * Self setup for fresh deployments (Render, a VPS, a new database):
 * applies the committed drizzle migrations when the schema is missing, and
 * seeds the events calendar when it is empty. On an already provisioned
 * database both steps are no ops, so the Kimi preview is unaffected.
 */
export async function runBootstrap(): Promise<void> {
  const db = getDb();

  const result = await db.execute(sql`SHOW TABLES LIKE 'events'`);
  const tableRows = (result as unknown as [unknown[]])[0];
  const tableExists = Array.isArray(tableRows) && tableRows.length > 0;

  if (!tableExists) {
    const migrationsFolder = path.join(process.cwd(), "db", "migrations");
    log.info("bootstrap: applying migrations", { migrationsFolder });
    await migrate(db, { migrationsFolder });
  }

  const existing = await db.select({ id: events.id }).from(events).limit(1);
  if (existing.length === 0) {
    log.info("bootstrap: seeding events calendar");
    await db.insert(events).values(buildEventSeeds());
  }
}
