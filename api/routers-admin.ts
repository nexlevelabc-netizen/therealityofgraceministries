import { z } from "zod";
import { asc, desc, eq } from "drizzle-orm";
import { createRouter, siteAdminProcedure } from "./middleware";
import { getDb } from "./queries/connection";
import {
  contactMessages,
  contributions,
  events,
  leaders,
  mediaFiles,
  messages,
  ministries,
  prayerRequests,
} from "@db/schema";

/* Everything the church team edits from /admin. Guarded by the cookie session
   issued at /api/admin/login. */

const MAX_UPLOAD_BYTES = 30 * 1024 * 1024;
const ALLOWED_MIME = /^(audio\/|image\/(png|jpe?g|webp|gif|avif))/;

function decodeUpload(input: { filename: string; mime: string; dataBase64: string }) {
  if (!ALLOWED_MIME.test(input.mime)) {
    throw new Error("Only audio files and images can be uploaded");
  }
  const buf = Buffer.from(input.dataBase64, "base64");
  if (buf.length === 0 || buf.length > MAX_UPLOAD_BYTES) {
    throw new Error("File must be between 1 byte and 30 MB");
  }
  return buf;
}

async function insertMedia(input: { filename: string; mime: string; dataBase64: string }) {
  const buf = decodeUpload(input);
  const db = getDb();
  const rows = await db
    .insert(mediaFiles)
    .values({
      filename: input.filename.slice(0, 255),
      mime: input.mime,
      sizeBytes: buf.length,
      data: input.dataBase64,
    })
    .returning({ id: mediaFiles.id });
  return rows[0].id;
}

const uploadInput = z.object({
  filename: z.string().min(1).max(255),
  mime: z.string().max(128),
  dataBase64: z.string().max(42 * 1024 * 1024), // base64 of 30 MB
});

const eventInput = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(5000).optional().nullable(),
  startsAt: z.string(), // ISO
  frequency: z.enum(["daily", "weekly", "monthly"]).default("weekly"),
  cadence: z.string().max(255).optional().nullable(),
  location: z.string().max(255).optional().nullable(),
  streamUrl: z.string().max(512).optional().nullable(),
});

const messageInput = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(10000).optional().nullable(),
  speaker: z.string().max(255).optional().nullable(),
  scripture: z.string().max(255).optional().nullable(),
  series: z.string().max(255).optional().nullable(),
  preachedAt: z.string(), // ISO
  topics: z.array(z.string().max(64)).max(12).default([]),
  youtubeId: z.string().max(32).optional().nullable(),
  audioMediaId: z.number().optional().nullable(),
  featured: z.boolean().default(false),
  messageOfMonth: z.boolean().default(false),
});

const ministryInput = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(128),
  summary: z.string().max(2000).optional().nullable(),
  body: z.string().max(20000).optional().nullable(),
  photoMediaId: z.number().optional().nullable(),
  sortOrder: z.number().default(0),
});

const leaderInput = z.object({
  name: z.string().min(1).max(255),
  role: z.string().max(255).optional().nullable(),
  bio: z.string().max(10000).optional().nullable(),
  photoMediaId: z.number().optional().nullable(),
  sortOrder: z.number().default(0),
});

export const adminRouter = createRouter({
  /* ---- uploads ---- */
  upload: siteAdminProcedure.input(uploadInput).mutation(async ({ input }) => {
    const id = await insertMedia(input);
    return { id, url: `/api/media/${id}` };
  }),

  /* ---- events ---- */
  events: createRouter({
    list: siteAdminProcedure.query(async () => {
      const db = getDb();
      return db.select().from(events).orderBy(desc(events.startsAt)).limit(300);
    }),
    create: siteAdminProcedure.input(eventInput).mutation(async ({ input }) => {
      const db = getDb();
      await db.insert(events).values({ ...input, startsAt: new Date(input.startsAt) });
      return { ok: true };
    }),
    update: siteAdminProcedure
      .input(z.object({ id: z.number(), data: eventInput }))
      .mutation(async ({ input }) => {
        const db = getDb();
        await db
          .update(events)
          .set({ ...input.data, startsAt: new Date(input.data.startsAt) })
          .where(eq(events.id, input.id));
        return { ok: true };
      }),
    remove: siteAdminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(events).where(eq(events.id, input.id));
      return { ok: true };
    }),
  }),

  /* ---- messages ---- */
  messages: createRouter({
    list: siteAdminProcedure.query(async () => {
      const db = getDb();
      return db
        .select()
        .from(messages)
        .orderBy(desc(messages.preachedAt))
        .limit(500);
    }),
    create: siteAdminProcedure.input(messageInput).mutation(async ({ input }) => {
      const db = getDb();
      await db.insert(messages).values({ ...input, preachedAt: new Date(input.preachedAt) });
      return { ok: true };
    }),
    update: siteAdminProcedure
      .input(z.object({ id: z.number(), data: messageInput }))
      .mutation(async ({ input }) => {
        const db = getDb();
        await db
          .update(messages)
          .set({ ...input.data, preachedAt: new Date(input.data.preachedAt) })
          .where(eq(messages.id, input.id));
        return { ok: true };
      }),
    remove: siteAdminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(messages).where(eq(messages.id, input.id));
      return { ok: true };
    }),
  }),

  /* ---- ministries ---- */
  ministries: createRouter({
    list: siteAdminProcedure.query(async () => {
      const db = getDb();
      return db.select().from(ministries).orderBy(asc(ministries.sortOrder), asc(ministries.id));
    }),
    create: siteAdminProcedure.input(ministryInput).mutation(async ({ input }) => {
      const db = getDb();
      await db.insert(ministries).values(input);
      return { ok: true };
    }),
    update: siteAdminProcedure
      .input(z.object({ id: z.number(), data: ministryInput }))
      .mutation(async ({ input }) => {
        const db = getDb();
        await db.update(ministries).set(input.data).where(eq(ministries.id, input.id));
        return { ok: true };
      }),
    remove: siteAdminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(ministries).where(eq(ministries.id, input.id));
      return { ok: true };
    }),
  }),

  /* ---- leaders ---- */
  leaders: createRouter({
    list: siteAdminProcedure.query(async () => {
      const db = getDb();
      return db.select().from(leaders).orderBy(asc(leaders.sortOrder), asc(leaders.id));
    }),
    create: siteAdminProcedure.input(leaderInput).mutation(async ({ input }) => {
      const db = getDb();
      await db.insert(leaders).values(input);
      return { ok: true };
    }),
    update: siteAdminProcedure
      .input(z.object({ id: z.number(), data: leaderInput }))
      .mutation(async ({ input }) => {
        const db = getDb();
        await db.update(leaders).set(input.data).where(eq(leaders.id, input.id));
        return { ok: true };
      }),
    remove: siteAdminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(leaders).where(eq(leaders.id, input.id));
      return { ok: true };
    }),
  }),

  /* ---- inbox: what visitors have sent ---- */
  inbox: createRouter({
    contacts: siteAdminProcedure.query(async () => {
      const db = getDb();
      return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt)).limit(200);
    }),
    prayers: siteAdminProcedure.query(async () => {
      const db = getDb();
      return db.select().from(prayerRequests).orderBy(desc(prayerRequests.createdAt)).limit(200);
    }),
    giving: siteAdminProcedure.query(async () => {
      const db = getDb();
      return db
        .select({
          id: contributions.id,
          reference: contributions.reference,
          fund: contributions.fund,
          amountPence: contributions.amountPence,
          monthly: contributions.monthly,
          giftAid: contributions.giftAid,
          name: contributions.name,
          email: contributions.email,
          status: contributions.status,
          createdAt: contributions.createdAt,
        })
        .from(contributions)
        .orderBy(desc(contributions.createdAt))
        .limit(200);
    }),
  }),
});
