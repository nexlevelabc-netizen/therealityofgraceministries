import { z } from "zod";
import { asc, desc, eq, sql } from "drizzle-orm";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { leaders, messages, ministries } from "@db/schema";

/* ---------- public teaching library, ministries and leadership ---------- */

const messageOut = {
  id: messages.id,
  title: messages.title,
  description: messages.description,
  speaker: messages.speaker,
  scripture: messages.scripture,
  series: messages.series,
  preachedAt: messages.preachedAt,
  topics: messages.topics,
  youtubeId: messages.youtubeId,
  audioMediaId: messages.audioMediaId,
  featured: messages.featured,
  messageOfMonth: messages.messageOfMonth,
  views: messages.views,
};

export const messagesRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        search: z.string().max(200).default(""),
        topic: z.string().max(64).default(""),
        sort: z.enum(["latest", "trending"]).default("latest"),
        limit: z.number().min(1).max(100).default(60),
      })
    )
    .query(async ({ input }) => {
      const db = getDb();
      const rows = await db
        .select(messageOut)
        .from(messages)
        .orderBy(
          input.sort === "trending" ? desc(messages.views) : desc(messages.preachedAt)
        )
        .limit(input.limit);
      const q = input.search.trim().toLowerCase();
      return rows.filter((m) => {
        if (input.topic && !m.topics.includes(input.topic)) return false;
        if (!q) return true;
        return [m.title, m.description ?? "", m.speaker ?? "", m.scripture ?? "", m.series ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(q);
      });
    }),

  ofTheMonth: publicQuery.query(async () => {
    const db = getDb();
    const rows = await db
      .select(messageOut)
      .from(messages)
      .where(eq(messages.messageOfMonth, true))
      .orderBy(desc(messages.preachedAt))
      .limit(1);
    return rows[0] ?? null;
  }),

  featured: publicQuery.query(async () => {
    const db = getDb();
    return db
      .select(messageOut)
      .from(messages)
      .where(eq(messages.featured, true))
      .orderBy(desc(messages.preachedAt))
      .limit(6);
  }),

  byId: publicQuery.input(z.object({ id: z.number() })).query(async ({ input }) => {
    const db = getDb();
    const rows = await db.select(messageOut).from(messages).where(eq(messages.id, input.id)).limit(1);
    return rows[0] ?? null;
  }),

  /* A play or an open counts as a view; powers the trending sort. */
  view: publicQuery.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    const db = getDb();
    await db
      .update(messages)
      .set({ views: sql`${messages.views} + 1` })
      .where(eq(messages.id, input.id));
    return { ok: true };
  }),

  related: publicQuery
    .input(z.object({ id: z.number(), topics: z.array(z.string()).default([]) }))
    .query(async ({ input }) => {
      const db = getDb();
      const rows = await db
        .select(messageOut)
        .from(messages)
        .orderBy(desc(messages.preachedAt))
        .limit(40);
      const overlap = rows.filter(
        (m) => m.id !== input.id && m.topics.some((topic) => input.topics.includes(topic))
      );
      const rest = rows.filter((m) => m.id !== input.id && !overlap.includes(m));
      return [...overlap, ...rest].slice(0, 3);
    }),
});

export const ministriesRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db
      .select({
        id: ministries.id,
        name: ministries.name,
        slug: ministries.slug,
        summary: ministries.summary,
        body: ministries.body,
        photoMediaId: ministries.photoMediaId,
      })
      .from(ministries)
      .orderBy(asc(ministries.sortOrder), asc(ministries.id));
  }),
});

export const leadersRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db
      .select({
        id: leaders.id,
        name: leaders.name,
        role: leaders.role,
        bio: leaders.bio,
        photoMediaId: leaders.photoMediaId,
      })
      .from(leaders)
      .orderBy(asc(leaders.sortOrder), asc(leaders.id));
  }),
});
