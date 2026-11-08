# The Reality of Grace Ministries Int'l

Full stack church website: React 19 + TypeScript + Vite frontend, Hono + tRPC +
Drizzle (Postgres) backend. Features Stripe and bank transfer giving, live
streaming (own HLS broadcast or YouTube simulcast with caption translation),
a multilingual pastoral chatbot (English, Spanish, Italian, Portuguese,
Arabic, Chinese, French), site wide language switching, events calendar,
and automated form delivery to the ministry inbox.

## Local development

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL at minimum
npm run dev
```

## Deploying to Render

The repo includes a `render.yaml` blueprint.

1. In the Render dashboard: New → Blueprint, connect this repository.
   Render reads `render.yaml` and creates the web service.
2. Render does not host Postgres, so create a free project at neon.tech and
   copy its connection string from the Neon dashboard.
3. In the Render service → Environment, set:
   - `DATABASE_URL` (required) — `postgres://user:password@host.neon.tech/dbname?sslmode=require`
   - `STRIPE_SECRET_KEY` — enables live card giving (optional; without it the
     give page uses the bank transfer pledge form)
   - `SITE_ORIGIN` — your Render URL, used for Stripe redirect links
   - `STREAM_HLS_URL` — your .m3u8 playback URL from Mux, Cloudflare Stream
     or api.video for the ministry's own broadcast (optional)
   - `CHAT_AI_BASE_URL`, `CHAT_AI_API_KEY`, `CHAT_AI_MODEL` — any
     OpenAI-compatible chat endpoint for the Grace Companion widget,
     e.g. Moonshot at `https://api.moonshot.ai/v1` (optional)
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` — form notifications
     to info@therealityofgraceministries.com (optional)
4. Deploy. On first boot the server applies the database migrations and
   seeds the events calendar automatically. No manual database steps.

Health check endpoint: `/api/health`.

## Member sign in

Sign in with Kimi works only when the site runs on the Kimi platform. On
Render or any other host the sign in page shows a graceful notice instead,
and all other features work normally.

## Useful scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local dev server |
| `npm run build` | Production build (frontend + backend bundle) |
| `npm start` | Run the production server |
| `npm run check` | TypeScript check |
| `npm run db:seed` | Reseed the events calendar |
