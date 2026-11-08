import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  bigint,
  int,
  boolean,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Note: FK columns referencing a serial() PK must use:
//   bigint("columnName", { mode: "number", unsigned: true }).notNull()

export const events = mysqlTable("events", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  startsAt: timestamp("startsAt").notNull(),
  location: varchar("location", { length: 255 }),
  streamUrl: varchar("streamUrl", { length: 512 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type Event = typeof events.$inferSelect;

export const contributions = mysqlTable("contributions", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }),
  reference: varchar("reference", { length: 32 }).notNull().unique(),
  fund: varchar("fund", { length: 64 }).notNull(),
  amountPence: int("amountPence").notNull(),
  currency: varchar("currency", { length: 8 }).default("gbp").notNull(),
  monthly: boolean("monthly").default(false).notNull(),
  giftAid: boolean("giftAid").default(false).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  status: mysqlEnum("status", ["pledged", "checkout_started", "paid", "failed"])
    .default("pledged")
    .notNull(),
  stripeSessionId: varchar("stripeSessionId", { length: 255 }),
  consentGiven: boolean("consentGiven").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type Contribution = typeof contributions.$inferSelect;

export const prayerRequests = mysqlTable("prayer_requests", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }),
  name: varchar("name", { length: 255 }),
  contact: varchar("contact", { length: 320 }),
  message: text("message").notNull(),
  language: varchar("language", { length: 8 }).default("en").notNull(),
  consentGiven: boolean("consentGiven").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type PrayerRequest = typeof prayerRequests.$inferSelect;

export const contactMessages = mysqlTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  topic: varchar("topic", { length: 64 }).notNull(),
  message: text("message").notNull(),
  consentGiven: boolean("consentGiven").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type ContactMessage = typeof contactMessages.$inferSelect;
