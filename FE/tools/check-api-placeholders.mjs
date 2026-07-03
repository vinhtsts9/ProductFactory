import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const srcDir = fileURLToPath(new URL("../src/features/", import.meta.url));

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const apiFiles = walk(srcDir).filter((file) => file.endsWith("api.ts"));
const rows = apiFiles.map((file) => {
  const text = readFileSync(file, "utf8");
  const todos = text.match(/TODO\(API[^)]*\)/g) ?? [];
  return { file: file.replace(srcDir, "features/"), todos: todos.length };
});

for (const row of rows) {
  console.log(`${row.file}: ${row.todos} API placeholders`);
}

if (rows.length === 0) {
  throw new Error("No feature api.ts files found.");
}
