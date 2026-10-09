import { createHmac } from "node:crypto";
import { PublicError } from "./config.js";

// Atomic all-or-nothing reservation; failures and cancellations consume the reservation.
export const quotaScript = `
for i,key in ipairs(KEYS) do
  if tonumber(redis.call('GET', key) or '0') >= tonumber(ARGV[(i-1)*2+1]) then return 0 end
end
for i,key in ipairs(KEYS) do
  local n = redis.call('INCR', key)
  if n == 1 then redis.call('EXPIRE', key, tonumber(ARGV[(i-1)*2+2])) end
end
return 1
`;
export async function reserveQuota(
  req,
  mode,
  config,
  fetcher = fetch,
  now = new Date(),
) {
  // Vercel overwrites this header at its trusted edge. Never trust generic X-Forwarded-For.
  const ip = config.vercel
    ? req.headers["x-vercel-forwarded-for"]
    : req.socket?.remoteAddress;
  if (typeof ip !== "string" || !ip || ip.length > 200)
    throw new PublicError(
      503,
      "unavailable",
      "The AI guide is temporarily unavailable.",
    );
  const day = now.toISOString().slice(0, 10);
  const hash = createHmac("sha256", config.salt)
    .update(day + ":" + ip)
    .digest("hex");
  const keys = [
    `ask:v1:${mode}:${hash}:${Math.floor(now.getTime() / 3600000)}`,
    `ask:v1:day:${day}`,
    `ask:v1:month:${day.slice(0, 7)}`,
  ];
  let result;
  try {
    const response = await fetcher(config.redisUrl, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + config.redisToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        "EVAL",
        quotaScript,
        "3",
        ...keys,
        String(mode === "chat" ? config.chatLimit : config.compareLimit),
        "3600",
        String(config.dailyLimit),
        "86400",
        String(config.monthlyLimit),
        "2764800",
      ]),
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) throw new Error("Quota unavailable");
    result = await response.json();
    if (result.error || ![0, 1].includes(result.result))
      throw new Error("Invalid quota response");
  } catch {
    throw new PublicError(
      503,
      "unavailable",
      "The AI guide is temporarily unavailable.",
    );
  }
  if (result.result === 0)
    throw new PublicError(
      429,
      "rate_limit",
      "The AI guide has reached its request limit. Please try later or explore the source links.",
    );
}
