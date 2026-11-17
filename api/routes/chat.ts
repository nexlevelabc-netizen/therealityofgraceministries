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

/* When no AI provider is configured the companion still answers warmly and
   points people to the pastoral team, so the widget never feels broken. */
const FALLBACK_GREETING: Record<string, string> = {
  en: "Peace be with you. I am here to pray with you, to listen, and to help you find counsel. What is on your heart today?",
  es: "La paz sea contigo. Estoy aquí para orar contigo, escucharte y ayudarte a encontrar consejo. ¿Qué llevas en tu corazón hoy?",
  it: "La pace sia con te. Sono qui per pregare con te, ascoltarti e aiutarti a trovare consiglio. Cosa hai nel cuore oggi?",
  pt: "A paz esteja contigo. Estou aqui para orar contigo, ouvir-te e ajudar-te a encontrar conselho. O que está no teu coração hoje?",
  ar: "السلام معك. أنا هنا لأصلّي معك، وأنصت إليك، وأساعدك في إيجاد المشورة. ما الذي في قلبك اليوم؟",
  zh: "愿平安与你同在。我在这里为你代祷、倾听，并帮你找到辅导。今天你心里有什么事？",
  fr: "Que la paix soit avec vous. Je suis là pour prier avec vous, vous écouter et vous aider à trouver conseil. Qu'y a-t-il sur votre cœur aujourd'hui ?",
};

const FALLBACK_REPLY: Record<string, string> = {
  en: "Thank you for sharing this with me. I have heard you, and I would love for our pastors to pray over this with you. Please leave a request using the link below, or call us on 07908 407744 and a real person will pray with you.",
  es: "Gracias por compartirlo conmigo. Te he escuchado, y me encantaría que nuestros pastores oren por esto contigo. Deja tu petición con el enlace de abajo, o llámanos al 07908 407744 y una persona real orará contigo.",
  it: "Grazie per averlo condiviso con me. Ti ho ascoltato, e mi piacerebbe che i nostri pastori pregassero per questo con te. Lascia una richiesta con il link qui sotto, oppure chiamaci al 07908 407744 e una persona vera pregherà con te.",
  pt: "Obrigado por partilhares isto comigo. Ouvi-te, e gostaria que os nossos pastores orassem sobre isto contigo. Deixa um pedido no link abaixo, ou liga para 07908 407744 e uma pessoa real orará contigo.",
  ar: "شكراً لأنك شاركتني هذا. لقد سمعتك، ويسعدني أن يصلّي رعاتنا من أجل هذا معك. اترك طلباً عبر الرابط أدناه، أو اتصل بنا على 07908 407744 وسيصلّي معك شخص حقيقي.",
  zh: "谢谢你与我分享。我已经听到了，也很愿意让我们的牧者与你一起为此祷告。请通过下方链接留下请求，或致电 07908 407744，会有真人与你一起祷告。",
  fr: "Merci de l'avoir partagé avec moi. Je vous ai entendu, et j'aimerais que nos pasteurs prient pour cela avec vous. Laissez une demande avec le lien ci dessous, ou appelez le 07908 407744 et une vraie personne priera avec vous.",
};

chatRoutes.get("/status", (c) => {
  const available = Boolean(
    (process.env.KIMI_AGENTGW_BASE_URL && process.env.KIMI_AGENTGW_API_KEY) ||
      (process.env.CHAT_AI_BASE_URL && process.env.CHAT_AI_API_KEY && process.env.CHAT_AI_MODEL)
  );
  return c.json({ available });
});

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
      log.warn("chat: no AI provider configured, serving pastoral fallback");
      const langKey = payload.language ?? "en";
      const text = payload.greet
        ? (FALLBACK_GREETING[langKey] ?? FALLBACK_GREETING.en)
        : (FALLBACK_REPLY[langKey] ?? FALLBACK_REPLY.en);
      return c.body(text, 200, { "Content-Type": "text/plain; charset=utf-8" });
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
