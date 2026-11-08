import {
  pgTable,
  pgEnum,
  serial,
  varchar,
  text,
  timestamp,
  bigint,
  integer,
  boolean,
} from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["user", "admin"]);
export const eventFrequency = pgEnum("event_frequency", ["daily", "weekly", "monthly"]);
export const contributionStatus = pgEnum("contribution_status", [
  "pledged",
  "checkout_started",
  "paid",
  "failed",
]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: userRole("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  startsAt: timestamp("startsAt").notNull(),
  frequency: eventFrequency("frequency").default("weekly").notNull(),
  cadence: varchar("cadence", { length: 255 }),
  location: varchar("location", { length: 255 }),
  streamUrl: varchar("streamUrl", { length: 512 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type Event = typeof events.$inferSelect;

export const contributions = pgTable("contributions", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number" }),
  reference: varchar("reference", { length: 32 }).notNull().unique(),
  fund: varchar("fund", { length: 64 }).notNull(),
  amountPence: integer("amountPence").notNull(),
  currency: varchar("currency", { length: 8 }).default("gbp").notNull(),
  monthly: boolean("monthly").default(false).notNull(),
  giftAid: boolean("giftAid").default(false).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  status: contributionStatus("status").default("pledged").notNull(),
  stripeSessionId: varchar("stripeSessionId", { length: 255 }),
  consentGiven: boolean("consentGiven").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type Contribution = typeof contributions.$inferSelect;

export const prayerRequests = pgTable("prayer_requests", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number" }),
  name: varchar("name", { length: 255 }),
  contact: varchar("contact", { length: 320 }),
  message: text("message").notNull(),
  language: varchar("language", { length: 8 }).default("en").notNull(),
  consentGiven: boolean("consentGiven").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type PrayerRequest = typeof prayerRequests.$inferSelect;

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  topic: varchar("topic", { length: 64 }).notNull(),
  message: text("message").notNull(),
  consentGiven: boolean("consentGiven").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type ContactMessage = typeof contactMessages.$inferSelect;
