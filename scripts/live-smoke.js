import { loadEnv } from "vite";
import { configuration } from "../server/config.js";
import { generate } from "../server/provider.js";
Object.assign(process.env, loadEnv("development", process.cwd(), ""));
const config = configuration();
if (!config.enabled) { console.log("SKIPPED: live AI unverified; configure credentials and shared protections first."); } else {
  const result = await generate("chat", { message: "Give me a 30-second overview.", history: [], projectId: null }, config, AbortSignal.timeout(45000));
  console.log("Live smoke passed schema validation; source IDs:", result.sourceIds.join(", "));
}
