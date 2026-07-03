import { Buffer } from "node:buffer";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { gunzipSync } from "node:zlib";

const root = new URL("../", import.meta.url);
const workspaceRoot = new URL("../../", import.meta.url);
const sourceHtml = new URL("Product Factory 5.1.html", workspaceRoot);
const outDir = new URL("migration/original/", root);

function ensureFile(pathname) {
  mkdirSync(dirname(pathname), { recursive: true });
}

function readScriptPayload(html, type) {
  const pattern = new RegExp(`<script\\s+type=["']${type}["']\\s*>([\\s\\S]*?)<\\/script>`, "i");
  const match = html.match(pattern);
  if (!match) throw new Error(`Missing script[type="${type}"]`);
  return match[1].trim();
}

function extensionFor(mime) {
  if (mime.includes("javascript")) return ".js";
  if (mime.includes("css")) return ".css";
  if (mime.includes("svg")) return ".svg";
  if (mime.includes("woff2")) return ".woff2";
  if (mime.includes("png")) return ".png";
  if (mime.includes("jpeg")) return ".jpg";
  if (mime.includes("json")) return ".json";
  return ".bin";
}

const html = readFileSync(sourceHtml, "utf8");
const manifest = JSON.parse(readScriptPayload(html, "__bundler/manifest"));
const template = JSON.parse(readScriptPayload(html, "__bundler/template"));

ensureFile(fileURLToPath(new URL("template.html", outDir)));
writeFileSync(new URL("template.html", outDir), template);
writeFileSync(new URL("manifest.json", outDir), JSON.stringify(manifest, null, 2));

const assetIndex = [];
for (const [uuid, entry] of Object.entries(manifest)) {
  const raw = Buffer.from(entry.data, "base64");
  const bytes = entry.compressed ? gunzipSync(raw) : raw;
  const ext = extensionFor(entry.mime);
  const assetPath = join(fileURLToPath(outDir), "assets", `${uuid}${ext}`);
  ensureFile(assetPath);
  writeFileSync(assetPath, bytes);
  assetIndex.push({ uuid, mime: entry.mime, compressed: Boolean(entry.compressed), file: `assets/${uuid}${ext}` });
}

writeFileSync(new URL("assets.json", outDir), JSON.stringify(assetIndex, null, 2));

const cssFiles = assetIndex.filter((asset) => asset.file.endsWith(".css")).length;
const jsFiles = assetIndex.filter((asset) => asset.file.endsWith(".js")).length;
const fontFiles = assetIndex.filter((asset) => asset.file.endsWith(".woff2")).length;

console.log(`Extracted template and ${assetIndex.length} assets`);
console.log(`JS=${jsFiles}, CSS=${cssFiles}, fonts=${fontFiles}`);
