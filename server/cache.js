import { createHash } from "node:crypto";
import { validateOutput } from "../shared/assistant.js";
import { knowledge } from "./knowledge.js";
import { instructions } from "./provider.js";

const ONE_DAY = 86400;
let fingerprint;
const version = () =>
  (fingerprint ??= createHash("sha256").update(JSON.stringify(knowledge) + instructions("chat")).digest("hex").slice(0, 16));

export function cacheKey(data, model) {
  if (data.history.length) return null;
  const question = data.message.toLowerCase().replace(/\s+/g, " ").replace(/[\s?.!]+$/, "").trim();
  return "ask:v1:answer:" + createHash("sha256").update([version(), model, data.projectId ?? "", question].join("\n")).digest("hex");
}

async function redis(config, command, fetcher) {
  const response = await fetcher(config.redisUrl, {
    method: "POST",
    headers: { Authorization: "Bearer " + config.redisToken, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    signal: AbortSignal.timeout(2000),
  });
  if (!response.ok) throw new Error("Cache unavailable");
  const body = await response.json();
  if (body.error) throw new Error("Cache error");
  return body.result;
}

// A cache problem must never block a fresh answer, so both helpers fail quietly.
export async function readCachedAnswer(key, config, fetcher = fetch) {
  try {
    const raw = await redis(config, ["GET", key], fetcher);
    return raw ? validateOutput("chat", JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}
export async function cacheAnswer(key, output, config, fetcher = fetch) {
  try {
    await redis(config, ["SET", key, JSON.stringify({ answer: output.answer, sourceIds: output.sourceIds }), "EX", String(ONE_DAY)], fetcher);
  } catch {
    /* Best effort: the visitor already has their answer. */
  }
}
