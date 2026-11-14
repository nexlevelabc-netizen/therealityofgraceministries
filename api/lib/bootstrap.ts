import { migrate } from "drizzle-orm/node-postgres/migrator";
import path from "path";
import { getDb } from "../queries/connection";
import { events, ministries } from "@db/schema";
import { buildEventSeeds, buildMinistrySeeds } from "../../db/seed-data";
import { log } from "./logger";

/**
 * Self setup for fresh deployments (Render, a VPS, a new database):
 * applies the committed drizzle migrations when the schema is missing, and
 * seeds the events calendar and ministries when they are empty. On an already
 * provisioned database every step is a no op, so the Kimi preview is unaffected.
 */
export async function runBootstrap(): Promise<void> {
  const db = getDb();

  /* The drizzle migrator is idempotent: it records applied migrations in
     __drizzle_migrations and only runs what is new. Running it on every boot
     keeps existing databases up to date when new migrations ship, not just
     on the very first deploy. */
  const migrationsFolder = path.join(process.cwd(), "db", "migrations");
  log.info("bootstrap: applying migrations", { migrationsFolder });
  await migrate(db, { migrationsFolder });

  const existing = await db.select({ id: events.id }).from(events).limit(1);
  if (existing.length === 0) {
    log.info("bootstrap: seeding events calendar");
    await db.insert(events).values(buildEventSeeds());
  }

  const existingMinistries = await db.select({ id: ministries.id }).from(ministries).limit(1);
  if (existingMinistries.length === 0) {
    log.info("bootstrap: seeding ministries");
    await db.insert(ministries).values(buildMinistrySeeds());
  }
}
