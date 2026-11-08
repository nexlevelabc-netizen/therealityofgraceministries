import { Hono } from "hono";
import { streamText } from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { classifyAiError, listModels } from "../ai/ai-client";
import { log } from "../lib/logger";

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  es: "Spanish",
  it: "Italian",
  pt: "Portuguese",
  ar: "Arabic",
  zh: "Simplified Chinese",
  fr: "French",
};

const SYSTEM = `You are the Grace Companion of The Reality of Grace Ministries Int'l, a warm Christian church in the United Kingdom.
Your calling is to pray with people, listen without judgement, and gently counsel from a biblical perspective of grace.
Rules you always follow:
- Reply only in the language named in the instruction, even if the person writes in another language.
- Keep replies short and human, two to four sentences, then one gentle question or an offered prayer.
- When someone shares a burden, acknowledge it with empathy before anything else.
- Offer to pray a short written prayer when it would comfort them.
- Never give medical, legal or financial advice. Suggest speaking with the pastoral team or a professional instead.
- If someone seems at risk of harming themselves or others, urge them kindly to contact local emergency services immediately, and mention the church phone 07908 407744.
- Never ask for money, passwords, or personal documents.
- You may suggest leaving a prayer request for the pastoral team using the form below the chat.`;

export const chatRoutes = new Hono();

chatRoutes.post("/", async (c) => {
  let payload: { language?: string; messages?: { role: string; content: string }[] };
  try {
    payload = await c.req.json();
  } catch {
    return c.json({ error: "Invalid body" }, 400);
  }

  const language = LANGUAGE_NAMES[payload.language ?? "en"] ?? "English";
  const messages = (payload.messages ?? [])
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-12)
    .map((m) => ({ role: m.role as "user" | "assistant", content: m.content.slice(0, 2000) }));

  if (messages.length === 0) {
    return c.json({ error: "No messages" }, 400);
  }

  try {
    const { defaultModelId } = await listModels();
    const kimiGw = createOpenAICompatible({
      name: "kimi-gw",
      baseURL: process.env.KIMI_AGENTGW_BASE_URL!,
      apiKey: process.env.KIMI_AGENTGW_API_KEY!,
    });

    const result = streamText({
      model: kimiGw(defaultModelId),
      system: `${SYSTEM}\n\nThe person has chosen ${language}. Reply only in ${language}.`,
      messages,
      providerOptions: { "kimi-gw": { max_completion_tokens: 700 } },
    });

    return result.toTextStreamResponse();
  } catch (err) {
    const classified = classifyAiError(err);
    log.error("chat failed", { error: classified.message, name: classified.name });
    const status = classified.name === "AiTransient" ? 503 : 500;
    return c.json({ error: "The companion is unavailable right now" }, status);
  }
});
