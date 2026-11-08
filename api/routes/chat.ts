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
- You may suggest leaving a prayer request for the pastoral team using the form below the chat.
- Never use em dashes or hyphens as punctuation in your replies. Use commas, full stops, or the middle dot instead.`;

export const chatRoutes = new Hono();

const TOPIC_GUIDANCE: Record<string, string> = {
  prayer: "The person is here to ask for prayer. Move toward offering a short written prayer soon.",
  counselling: "The person seeks counselling. Listen carefully, ask one gentle question at a time, and suggest the pastoral team for anything deep or ongoing.",
  support: "The person needs practical support. Be warm and concrete, and point them to the pastoral team and the church phone for follow up.",
  testimony: "The person wants to share a testimony. Celebrate with them and invite them to share it with the church family.",
  newhere: "The person is new and curious about the church. Welcome them warmly and explain they can visit any Sunday or watch online.",
};

chatRoutes.post("/", async (c) => {
  let payload: {
    language?: string;
    topic?: string;
    greet?: boolean;
    messages?: { role: string; content: string }[];
  };
  try {
    payload = await c.req.json();
  } catch {
    return c.json({ error: "Invalid body" }, 400);
  }

  const language = LANGUAGE_NAMES[payload.language ?? "en"] ?? "English";
  const topicGuidance = TOPIC_GUIDANCE[payload.topic ?? ""] ?? "";
  let messages = (payload.messages ?? [])
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-12)
    .map((m) => ({ role: m.role as "user" | "assistant", content: m.content.slice(0, 2000) }));

  if (payload.greet) {
    messages = [
      {
        role: "user",
        content:
          "Open the conversation now: greet me warmly in two or three sentences, mention that you can pray, listen and counsel, and ask one gentle opening question.",
      },
    ];
  }

  if (messages.length === 0) {
    return c.json({ error: "No messages" }, 400);
  }

  try {
    // Two provider paths, same OpenAI-compatible wire format:
    //   1. Kimi platform gateway (KIMI_AGENTGW_*) — injected automatically when
    //      the site runs on Kimi; model id is discovered from the gateway.
    //   2. Any OpenAI-compatible endpoint (CHAT_AI_BASE_URL / CHAT_AI_API_KEY /
    //      CHAT_AI_MODEL) — for self hosted deployments such as Render, e.g.
    //      Moonshot (https://api.moonshot.ai/v1) or OpenAI.
    const gatewayBase = process.env.KIMI_AGENTGW_BASE_URL;
    const gatewayKey = process.env.KIMI_AGENTGW_API_KEY;
    const customBase = process.env.CHAT_AI_BASE_URL;
    const customKey = process.env.CHAT_AI_API_KEY;
    const customModel = process.env.CHAT_AI_MODEL;

    let model;
    if (gatewayBase && gatewayKey) {
      const { defaultModelId } = await listModels();
      const kimiGw = createOpenAICompatible({
        name: "kimi-gw",
        baseURL: gatewayBase,
        apiKey: gatewayKey,
      });
      model = kimiGw(defaultModelId);
    } else if (customBase && customKey && customModel) {
      const custom = createOpenAICompatible({
        name: "chat-ai",
        baseURL: customBase,
        apiKey: customKey,
      });
      model = custom(customModel);
    } else {
      log.warn("chat unavailable: no AI provider configured");
      return c.json({ error: "The companion is unavailable right now" }, 503);
    }

    const result = streamText({
      model,
      system: `${SYSTEM}\n\nThe person has chosen ${language}. Reply only in ${language}.${topicGuidance ? `\n\n${topicGuidance}` : ""}`,
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
