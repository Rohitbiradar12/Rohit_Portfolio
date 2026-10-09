export class PublicError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
    this.message = message;
  }
}
export function configuration(env = process.env) {
  const positive = (name, fallback, ceiling) => {
    const n = Number(env[name] || fallback);
    if (!Number.isInteger(n) || n < 1 || n > ceiling)
      throw new PublicError(
        503,
        "unavailable",
        "The AI guide is temporarily unavailable.",
      );
    return n;
  };
  let redisValid = false;
  try {
    const u = new URL(env.UPSTASH_REDIS_REST_URL);
    redisValid =
      u.protocol === "https:" &&
      u.hostname.endsWith(".upstash.io") &&
      !u.username &&
      !u.password;
  } catch {
    /* Fail closed. */
  }
  const key = env.GROQ_API_KEY || env.XAI_API_KEY;
  return {
    enabled:
      env.ASK_ROHIT_ENABLED === "true" &&
      !!key &&
      redisValid &&
      !!env.UPSTASH_REDIS_REST_TOKEN &&
      (env.ASK_ROHIT_IP_SALT || "").length >= 32,
    key,
    model: env.GROQ_MODEL || "openai/gpt-oss-120b",
    redisUrl: env.UPSTASH_REDIS_REST_URL,
    redisToken: env.UPSTASH_REDIS_REST_TOKEN,
    salt: env.ASK_ROHIT_IP_SALT,
    vercel: env.VERCEL === "1",
    chatLimit: positive("ASK_ROHIT_CHAT_PER_HOUR", 15, 100),
    compareLimit: positive("ASK_ROHIT_COMPARE_PER_HOUR", 4, 20),
    dailyLimit: positive("ASK_ROHIT_DAILY_REQUESTS", 100, 1000),
    monthlyLimit: positive("ASK_ROHIT_MONTHLY_REQUESTS", 1000, 10000),
  };
}
