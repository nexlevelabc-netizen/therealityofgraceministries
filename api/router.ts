import { authRouter } from "./auth-router";
import { createRouter, publicQuery } from "./middleware";
import { contactRouter, eventsRouter, givingRouter, prayerRouter, streamRouter } from "./routers";
import { leadersRouter, messagesRouter, ministriesRouter } from "./routers-content";
import { adminRouter } from "./routers-admin";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  events: eventsRouter,
  contact: contactRouter,
  prayer: prayerRouter,
  giving: givingRouter,
  stream: streamRouter,
  messages: messagesRouter,
  ministries: ministriesRouter,
  leaders: leadersRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
