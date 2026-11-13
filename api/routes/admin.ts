import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { mediaFiles } from "@db/schema";
import { getDb } from "../queries/connection";
import {
  ADMIN_COOKIE,
  adminEnabled,
  checkPassword,
  issueSession,
  sessionFromHeaders,
} from "../lib/admin-auth";
import { log } from "../lib/logger";

export const adminRoutes = new Hono();

adminRoutes.post("/login", async (c) => {
  if (!adminEnabled()) {
    return c.json({ error: "Admin access is not enabled on this deployment" }, 503);
  }
  let body: { password?: string };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid body" }, 400);
  }
  if (!checkPassword(body.password ?? "")) {
    log.warn("admin login rejected");
    return c.json({ error: "Wrong password" }, 401);
  }
  const token = issueSession();
  const secure = c.req.url.startsWith("https") ? "; Secure" : "";
  c.header(
    "Set-Cookie",
    `${ADMIN_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${12 * 3600}${secure}`
  );
  return c.json({ ok: true });
});

adminRoutes.post("/logout", (c) => {
  c.header("Set-Cookie", `${ADMIN_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
  return c.json({ ok: true });
});

adminRoutes.get("/check", (c) => {
  return c.json({ enabled: adminEnabled(), authed: sessionFromHeaders(c.req.raw.headers) });
});

/* Streams an uploaded file out of the media library. Range support lets audio
   playback seek properly. */
export const mediaRoutes = new Hono();

mediaRoutes.get("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (!Number.isFinite(id) || id <= 0) return c.json({ error: "Bad id" }, 400);
  const db = getDb();
  const rows = await db.select().from(mediaFiles).where(eq(mediaFiles.id, id)).limit(1);
  const file = rows[0];
  if (!file) return c.json({ error: "Not found" }, 404);

  const buf = Buffer.from(file.data, "base64");
  const range = c.req.header("range");
  c.header("Content-Type", file.mime);
  c.header("Accept-Ranges", "bytes");
  c.header("Cache-Control", "public, max-age=86400, immutable");

  if (range) {
    const m = range.match(/bytes=(\d*)-(\d*)/);
    const start = m?.[1] ? parseInt(m[1], 10) : 0;
    const end = m?.[2] ? Math.min(parseInt(m[2], 10), buf.length - 1) : buf.length - 1;
    if (start >= buf.length || start > end) {
      c.header("Content-Range", `bytes */${buf.length}`);
      return c.body(null, 416);
    }
    c.status(206);
    c.header("Content-Range", `bytes ${start}-${end}/${buf.length}`);
    c.header("Content-Length", String(end - start + 1));
    return c.body(new Uint8Array(buf.subarray(start, end + 1)));
  }

  c.header("Content-Length", String(buf.length));
  return c.body(new Uint8Array(buf));
});
