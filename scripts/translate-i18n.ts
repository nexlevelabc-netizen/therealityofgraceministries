import "dotenv/config";
import fs from "fs";
import path from "path";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { generateText } from "ai";
import { en } from "../src/i18n/en";

/**
 * One-off build time translation of the site dictionary.
 * Reads src/i18n/en.ts, writes src/i18n/<code>.ts for each target language.
 * Run: npx tsx scripts/translate-i18n.ts
 */

const TARGETS: Record<string, string> = {
  es: "Spanish (Spain)",
  it: "Italian",
  pt: "Portuguese (Portugal)",
  ar: "Arabic",
  zh: "Simplified Chinese",
  fr: "French",
};

async function main() {
  const gw = createOpenAICompatible({
    name: "kimi-gw",
    baseURL: process.env.KIMI_AGENTGW_BASE_URL!,
    apiKey: process.env.KIMI_AGENTGW_API_KEY!,
  });

  const listResp = await fetch(`${process.env.KIMI_AGENTGW_BASE_URL}/models`, {
    headers: { Authorization: `Bearer ${process.env.KIMI_AGENTGW_API_KEY}` },
  });
  const listJson = (await listResp.json()) as { default_model_id?: string; data?: { id: string }[] };
  const modelId = listJson.default_model_id ?? listJson.data?.[0]?.id;
  if (!modelId) throw new Error("no model available");
  console.log("model:", modelId);

  const source = JSON.stringify(en);

  for (const [code, name] of Object.entries(TARGETS)) {
    console.log("translating", code);
    const { text } = await generateText({
      model: gw(modelId),
      system: `You are a professional website translator for a Christian church. Translate the JSON string values from English into ${name}.
Rules:
- Return ONLY valid JSON with exactly the same keys and structure. Do not translate keys.
- Keep the {phone}, {email}, {context}, {amount}, {fund}, {reference} placeholder tokens unchanged.
- Keep array structures like [{\"t\": \"...\", \"i\": true}] intact: translate only the "t" values, never the "i" flags.
- Tone: warm, dignified, pastoral, natural native phrasing, never machine literal.
- The brand name "The Reality of Grace Ministries Int'l" stays in English everywhere it appears, except inside natural sentences where a translated descriptive mention reads better; product names, Stripe, Gift Aid, Kimi, YouTube stay as is.
- UK spellings become the natural local equivalent register.`,
      prompt: source,
      providerOptions: { "kimi-gw": { max_completion_tokens: 16000 } },
    });

    const cleaned = text.replace(/^```(?:json)?/m, "").replace(/```$/m, "").trim();
    const parsed = JSON.parse(cleaned);
    const out = `import type { Dict } from "./en";\n\nconst dict: Dict = ${JSON.stringify(parsed, null, 2)};\n\nexport default dict;\n`;
    fs.writeFileSync(path.resolve("src/i18n", `${code}.ts`), out);
    console.log("wrote", code);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
