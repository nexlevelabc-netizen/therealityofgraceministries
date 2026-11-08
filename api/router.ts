import { authRouter } from "./auth-router";
import { createRouter, publicQuery } from "./middleware";
import { contactRouter, eventsRouter, givingRouter, prayerRouter } from "./routers";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  events: eventsRouter,
  contact: contactRouter,
  prayer: prayerRouter,
  giving: givingRouter,
});

export type AppRouter = typeof appRouter;
