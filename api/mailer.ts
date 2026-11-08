import nodemailer from "nodemailer";
import { log } from "./lib/logger";

/**
 * Ministry inbox automation. Every form on the site (contact, first visit,
 * prayer follow ups, giving receipts) is mirrored to the ministry inbox.
 *
 * Configure with env vars (never hardcode):
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
 *   MAIL_TO   defaults to info@therealityofgraceministries.com
 *   MAIL_FROM defaults to the SMTP user
 *
 * Without SMTP config the mail is skipped and the record still persists in
 * the database, so nothing is ever lost.
 */

const DEFAULT_TO = "info@therealityofgraceministries.com";

function transport() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT ?? 587) === 465,
    auth: { user, pass },
  });
}

export async function notifyMinistry(subject: string, body: string): Promise<boolean> {
  const tx = transport();
  if (!tx) {
    log.info("mail skipped (no SMTP configured)", { subject });
    return false;
  }
  try {
    await tx.sendMail({
      from: process.env.MAIL_FROM ?? process.env.SMTP_USER,
      to: process.env.MAIL_TO ?? DEFAULT_TO,
      subject,
      text: body,
    });
    return true;
  } catch (err) {
    log.error("mail send failed", { subject, error: err instanceof Error ? err.message : String(err) });
    return false;
  }
}

export async function sendReceipt(to: string, subject: string, body: string): Promise<boolean> {
  const tx = transport();
  if (!tx) return false;
  try {
    await tx.sendMail({
      from: process.env.MAIL_FROM ?? process.env.SMTP_USER,
      to,
      subject,
      text: body,
    });
    return true;
  } catch (err) {
    log.error("receipt send failed", { error: err instanceof Error ? err.message : String(err) });
    return false;
  }
}
