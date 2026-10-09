import { LIMITS, validateOutput } from "../../shared/assistant.js";
export async function readChat(response, onStatus) {
  if (!response.body || !response.headers.get("content-type")?.includes("text/event-stream")) throw new Error("The guide returned an unexpected response.");
  const reader = response.body.getReader(), decoder = new TextDecoder();
  let buffer = "", total = 0, result;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > LIMITS.outputBytes * 3) throw new Error("The response was too large.");
      buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, "\n");
      let boundary;
      while ((boundary = buffer.indexOf("\n\n")) !== -1) {
        const block = buffer.slice(0, boundary); buffer = buffer.slice(boundary + 2);
        const event = block.split("\n").find(l => l.startsWith("event:"))?.slice(6).trim();
        const raw = block.split("\n").filter(l => l.startsWith("data:")).map(l => l.slice(5).trim()).join("\n");
        if (!raw) continue;
        const data = JSON.parse(raw);
        if (event === "status") onStatus(typeof data.message === "string" ? data.message.slice(0, 100) : "Working…");
        if (event === "error") throw new Error(data.message || "The response was interrupted.");
        if (event === "result") result = validateOutput("chat", { answer: data.answer, sourceIds: data.sourceIds });
      }
    }
    if (!result || buffer.trim()) throw new Error("The response was interrupted. Please retry.");
    return result;
  } finally { await reader.cancel().catch(() => {}); reader.releaseLock(); }
}
export async function requestAssistant(mode, body, signal, onStatus, fetcher = fetch) {
  const response = await fetcher("/api/" + mode, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const error = new Error(data.message || "The guide is unavailable. Please try again.");
    error.unavailable = response.status === 503;
    throw error;
  }
  if (mode === "chat") return readChat(response, onStatus);
  const raw = await response.text();
  if (raw.length > LIMITS.outputBytes * 2) throw new Error("The response was too large.");
  const data = JSON.parse(raw);
  return validateOutput("compare", { roleSummary: data.roleSummary, requirements: data.requirements?.map(({ requirement, evidence, explanation, sourceIds }) => ({ requirement, evidence, explanation, sourceIds })), projects: data.projects?.map(({ sourceId, reason }) => ({ sourceId, reason })), clarification: data.clarification, discussionTopics: data.discussionTopics });
}
