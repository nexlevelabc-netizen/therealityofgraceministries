/* Reassembles the Spoodbrush display font from the base64 parts in
   fonts/spoodbrush/ and writes it to public/fonts/spoodbrush.woff2.
   The font is stored as text parts so it survives text only tooling.
   Runs automatically before dev and build via the pre hooks in package.json. */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "fonts", "spoodbrush");
const manifest = JSON.parse(readFileSync(join(dir, "manifest.json"), "utf8"));

let b64 = "";
for (let i = 0; i < manifest.parts; i++) {
  const name = `part${String(i).padStart(2, "0")}.b64`;
  const file = join(dir, name);
  if (!existsSync(file)) {
    console.error(`bakefonts: missing ${name}`);
    process.exit(1);
  }
  b64 += readFileSync(file, "utf8").replace(/\s+/g, "");
}

const buf = Buffer.from(b64, "base64");
const sha = createHash("sha256").update(buf).digest("hex");
if (sha !== manifest.sha256) {
  console.error(`bakefonts: checksum mismatch, expected ${manifest.sha256}, got ${sha}`);
  process.exit(1);
}

const outDir = join(root, "public", "fonts");
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, manifest.file), buf);
console.log(`bakefonts: wrote public/fonts/${manifest.file} (${buf.length} bytes, checksum ok)`);
