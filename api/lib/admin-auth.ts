import { createHmac, timingSafeEqual } from "node:crypto";

/* Shared-secret admin session. The church team signs in with one password
   (ADMIN_PASSWORD env). The session cookie is an HMAC signed expiry stamp, so
   there is no session store and nothing extra to run. */

export const ADMIN_COOKIE = "trgmi_admin";
const SESSION_HOURS = 12;

function secret() {
  return process.env.ADMIN_PASSWORD?.trim() ?? "";
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

export function adminEnabled() {
  return secret().length > 0;
}

export function checkPassword(candidate: string) {
  const expected = secret();
  if (!expected || !candidate) return false;
  const a = Buffer.from(candidate);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function issueSession() {
  const exp = Date.now() + SESSION_HOURS * 3600 * 1000;
  return `${exp}.${sign(String(exp))}`;
}

export function verifySession(token: string | undefined | null) {
  if (!token || !adminEnabled()) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig) return false;
  if (Number(exp) < Date.now()) return false;
  const good = sign(exp);
  const a = Buffer.from(sig);
  const b = Buffer.from(good);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function sessionFromHeaders(headers: Headers) {
  const raw = headers.get("cookie") ?? "";
  const match = raw.match(new RegExp(`(?:^|;\\s*)${ADMIN_COOKIE}=([^;]+)`));
  return verifySession(match?.[1]);
}
