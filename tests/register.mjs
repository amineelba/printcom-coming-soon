// Test-only module hooks so `node --test` can load the app's TypeScript:
//  - maps the "@/..." alias to src/
//  - retries extensionless relative imports with ".ts"
//  - stubs the Next-only "server-only" marker package
import { register } from "node:module";

register("./hooks.mjs", import.meta.url);
