// Restores the binary brand and imagery assets from their base64 text copies
// in assets-b64/. The binaries themselves are not kept in git (the deployment
// pipeline used to publish this repo only carries text), so every fresh clone
// regenerates them here before the Vite build copies public/ into dist.
// Existing files are left untouched, so local previews with real binaries
// are never overwritten.
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(root, "assets-b64");

let restored = 0;
for (const name of readdirSync(srcDir)) {
  if (!name.endsWith(".b64")) continue;
  const rel = name.slice(0, -4).replaceAll("__", "/");
  const dest = join(root, rel);
  if (existsSync(dest)) continue;
  const b64 = readFileSync(join(srcDir, name), "utf8").replace(/\s+/g, "");
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, Buffer.from(b64, "base64"));
  restored++;
}
console.log(`decode-assets: ${restored} file(s) restored`);
