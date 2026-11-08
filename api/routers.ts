import { z } from "zod";
import { desc, eq, gte } from "drizzle-orm";
import { createRouter, publicQuery, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { contactMessages, contributions, events, prayerRequests } from "@db/schema";
import { notifyMinistry, sendReceipt } from "./mailer";

/* ---------- events ---------- */

export const eventsRouter = createRouter({
  upcoming: publicQuery
    .input(z.object({ limit: z.number().min(1).max(50).default(10) }))
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(events)
        .where(gte(events.startsAt, new Date(Date.now() - 48 * 3600 * 1000)))
        .orderBy(events.startsAt)
        .limit(input.limit);
    }),

  byFrequency: publicQuery
    .input(z.object({ frequency: z.enum(["all", "daily", "weekly", "monthly"]).default("all") }))
    .query(async ({ input }) => {
      const db = getDb();
      const rows = await db.select().from(events).orderBy(events.startsAt).limit(100);
      if (input.frequency === "all") return rows;
      return rows.filter((r) => r.frequency === input.frequency);
    }),
});

/* ---------- contact and visit forms ---------- */

export const contactRouter = createRouter({
  submit: publicQuery
    .input(
      z.object({
        name: z.string().min(1).max(255),
        email: z.string().email().max(320),
        topic: z.string().min(1).max(64),
        message: z.string().min(1).max(5000),
        consentGiven: z.literal(true),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.insert(contactMessages).values(input);
      const topicLabel =
        input.topic === "first_visit" ? "First visit" : input.topic.replace(/_/g, " ");
      await notifyMinistry(
        `Website ${topicLabel} from ${input.name}`,
        [
          `Topic: ${topicLabel}`,
          `Name: ${input.name}`,
          `Email: ${input.email}`,
          `Consent to privacy statement: yes`,
          "",
          input.message,
        ].join("\n")
      );
      return { ok: true };
    }),
});

/* ---------- prayer requests ---------- */

export const prayerRouter = createRouter({
  submit: publicQuery
    .input(
      z.object({
        name: z.string().max(255).optional().default(""),
        contact: z.string().max(320).optional().default(""),
        message: z.string().min(1).max(5000),
        language: z.string().max(8).default("en"),
        consentGiven: z.literal(true),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      await db.insert(prayerRequests).values({
        name: input.name || null,
        contact: input.contact || null,
        message: input.message,
        language: input.language,
        consentGiven: input.consentGiven,
        userId: ctx.user?.id ?? null,
      });
      await notifyMinistry(
        `Prayer request${input.name ? ` from ${input.name}` : " (anonymous)"}`,
        [
          `Name: ${input.name || "Anonymous"}`,
          `Follow up contact: ${input.contact || "None left"}`,
          `Language: ${input.language}`,
          `Consent to privacy statement: yes`,
          "",
          input.message,
        ].join("\n")
      );
      return { ok: true };
    }),

  mine: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    return db
      .select()
      .from(prayerRequests)
      .where(eq(prayerRequests.userId, ctx.user.id))
      .orderBy(desc(prayerRequests.createdAt))
      .limit(50);
  }),
});

/* ---------- giving ---------- */

function makeReference(): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `TRG ${stamp}${rand}`.replace(/[^A-Z0-9 ]/g, "").slice(0, 20);
}

export const givingRouter = createRouter({
  begin: publicQuery
    .input(
      z.object({
        fund: z.enum(["tithes", "offerings", "kingdom", "compassion"]),
        amountGbp: z.number().min(1).max(100000),
        monthly: z.boolean(),
        giftAid: z.boolean(),
        name: z.string().min(1).max(255),
        email: z.string().email().max(320),
        consentGiven: z.literal(true),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const reference = makeReference();
      const amountPence = Math.round(input.amountGbp * 100);

      /* Stripe Checkout, when the ministry's secret key is configured */
      const stripeKey = process.env.STRIPE_SECRET_KEY;
      let checkoutUrl: string | null = null;
      let stripeSessionId: string | null = null;

      if (stripeKey) {
        try {
          const origin = process.env.SITE_ORIGIN ?? "";
          const body = new URLSearchParams({
            mode: input.monthly ? "subscription" : "payment",
            success_url: `${origin}/give?thanks=1`,
            cancel_url: `${origin}/give`,
            customer_email: input.email,
            "line_items[0][quantity]": "1",
            "line_items[0][price_data][currency]": "gbp",
            "line_items[0][price_data][unit_amount]": String(amountPence),
            "line_items[0][price_data][product_data][name]": `${input.fund} · The Reality of Grace Ministries Int'l`,
            "metadata[reference]": reference,
            "metadata[fund]": input.fund,
            "payment_method_types[0]": "card",
            "payment_method_types[1]": "bacs_debit",
          });
          if (input.monthly) {
            body.set("line_items[0][price_data][recurring][interval]", "month");
          }
          const resp = await fetch("https://api.stripe.com/v1/checkout/sessions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${stripeKey}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body,
          });
          if (resp.ok) {
            const session = (await resp.json()) as { id: string; url: string };
            checkoutUrl = session.url;
            stripeSessionId = session.id;
          }
        } catch {
          checkoutUrl = null;
        }
      }

      await db.insert(contributions).values({
        userId: ctx.user?.id ?? null,
        reference,
        fund: input.fund,
        amountPence,
        monthly: input.monthly,
        giftAid: input.giftAid,
        name: input.name,
        email: input.email,
        status: checkoutUrl ? "checkout_started" : "pledged",
        stripeSessionId,
        consentGiven: input.consentGiven,
      });

      await notifyMinistry(
        `New ${input.monthly ? "monthly " : ""}gift pledged: £${input.amountGbp} to ${input.fund}`,
        [
          `Reference: ${reference}`,
          `Fund: ${input.fund}`,
          `Amount: GBP ${input.amountGbp.toFixed(2)}${input.monthly ? " per month" : ""}`,
          `Gift Aid: ${input.giftAid ? "yes" : "no"}`,
          `Name: ${input.name}`,
          `Email: ${input.email}`,
          `Payment: ${checkoutUrl ? "Stripe checkout opened" : "bank transfer expected"}`,
        ].join("\n")
      );

      if (!checkoutUrl) {
        await sendReceipt(
          input.email,
          `Your giving reference ${reference}`,
          [
            `Dear ${input.name},`,
            "",
            `Thank you for your gift of GBP ${input.amountGbp.toFixed(2)} toward ${input.fund}.`,
            `Your reference is ${reference}.`,
            "",
            "To complete by bank transfer, reply to this email and we will confirm the account details securely.",
            "",
            "Every blessing,",
            "The Reality of Grace Ministries Int'l",
          ].join("\n")
        );
      }

      return { reference, checkoutUrl };
    }),

  mine: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    return db
      .select()
      .from(contributions)
      .where(eq(contributions.userId, ctx.user.id))
      .orderBy(desc(contributions.createdAt))
      .limit(100);
  }),
});
