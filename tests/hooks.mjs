import { pathToFileURL } from "node:url";
import path from "node:path";
import fs from "node:fs";

const SRC = path.resolve(import.meta.dirname, "../src");

export async function resolve(specifier, context, nextResolve) {
  if (specifier === "server-only") {
    return { url: "data:text/javascript,", shortCircuit: true };
  }
  let target = specifier;
  if (specifier.startsWith("@/")) {
    target = pathToFileURL(path.join(SRC, specifier.slice(2))).href;
  } else if (specifier.startsWith(".") && context.parentURL) {
    target = new URL(specifier, context.parentURL).href;
  } else {
    return nextResolve(specifier, context);
  }
  for (const candidate of [target, `${target}.ts`, `${target}/index.ts`]) {
    const file = candidate.startsWith("file:") ? new URL(candidate) : null;
    if (file && fs.existsSync(file) && fs.statSync(file).isFile()) {
      return nextResolve(candidate, context);
    }
  }
  return nextResolve(target, context);
}
