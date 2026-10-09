import { chatInput, compareInput, LIMITS } from "../shared/assistant.js";
import { configuration, PublicError } from "./config.js";
import { reserveQuota } from "./rate-limit.js";
import { generate } from "./provider.js";
import { attachSources } from "./knowledge.js";

export async function readBody(req) {
  if (!/^application\/json(?:\s*;|$)/i.test(req.headers["content-type"] || ""))
    throw new PublicError(415, "invalid_input", "Send a JSON request.");
  const length = Number(req.headers["content-length"] || 0);
  if (!Number.isFinite(length) || length > LIMITS.bodyBytes)
    throw new PublicError(413, "too_large", "The request is too large.");
  let raw;
  if (req.body !== undefined)
    raw = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
  else {
    const chunks = [];
    let size = 0;
    for await (const chunk of req) {
      size += Buffer.byteLength(chunk);
      if (size > LIMITS.bodyBytes)
        throw new PublicError(413, "too_large", "The request is too large.");
      chunks.push(Buffer.from(chunk));
    }
    raw = Buffer.concat(chunks).toString("utf8");
  }
  if (Buffer.byteLength(raw) > LIMITS.bodyBytes)
    throw new PublicError(413, "too_large", "The request is too large.");
  try {
    return JSON.parse(raw);
  } catch {
    throw new PublicError(400, "invalid_input", "Invalid JSON request.");
  }
}
export function createHandler(mode, deps = {}) {
  return async (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Content-Type-Options", "nosniff");
    let streaming = false;
    const controller = new AbortController();
    const onClose = () => {
      if (!res.writableEnded) controller.abort();
    };
    res.on("close", onClose);
    let timer;
    const emit = (event, data) => {
      if (!res.destroyed && !res.writableEnded)
        res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    };
    try {
      if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        throw new PublicError(405, "method", "Use POST.");
      }
      const body = await readBody(req);
      const parsed = (mode === "chat" ? chatInput : compareInput).safeParse(
        body,
      );
      if (!parsed.success)
        throw new PublicError(
          400,
          "invalid_input",
          mode === "chat"
            ? "Enter a question up to 2,000 characters with valid recent history."
            : "Paste a job description between 40 and 12,000 characters.",
        );
      const config = (deps.configuration || configuration)();
      if (!config.enabled)
        throw new PublicError(
          503,
          "unavailable",
          "The AI guide is not available right now. Explore Rohit's published work below.",
        );
      await (deps.reserveQuota || reserveQuota)(req, mode, config);
      timer = setTimeout(
        () => controller.abort(new Error("timeout")),
        deps.timeoutMs || LIMITS.timeoutMs,
      );
      if (mode === "chat") {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
        res.setHeader("X-Accel-Buffering", "no");
        res.flushHeaders?.();
        streaming = true;
        emit("status", { message: "Reading the published portfolio…" });
      }
      const output = await (deps.generate || generate)(
        mode,
        parsed.data,
        config,
        controller.signal,
        (message) => {
          if (streaming) emit("status", { message });
        },
      );
      if (controller.signal.aborted) throw new Error("Aborted");
      const result = attachSources(mode, output);
      if (streaming) {
        emit("result", result);
        res.end();
      } else {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(result));
      }
    } catch (error) {
      if (res.destroyed || res.writableEnded) return;
      const known = error instanceof PublicError;
      const payload = {
        code: controller.signal.aborted
          ? "timeout"
          : known
            ? error.code
            : "provider_error",
        message: controller.signal.aborted
          ? "The request took too long. Please retry."
          : known
            ? error.message
            : "The AI guide could not complete this request. Please retry.",
      };
      if (streaming) {
        emit("error", payload);
        res.end();
      } else {
        res.statusCode = known
          ? error.status
          : controller.signal.aborted
            ? 504
            : 502;
        res.setHeader("Content-Type", "application/json");
        if (res.statusCode === 429) res.setHeader("Retry-After", "3600");
        res.end(JSON.stringify(payload));
      }
    } finally {
      clearTimeout(timer);
      res.off("close", onClose);
      controller.abort();
    }
  };
}
