import { z } from "zod";

export const LIMITS = Object.freeze({ message: 2000, job: 12000, history: 12, bodyBytes: 48000, outputBytes: 24000, timeoutMs: 45000 });
export const projectIds = ["project-1", "project-2", "project-3", "project-4", "project-5"];
export const sourceIds = ["profile", "experience", "role-aws", "role-engineer", "role-intern", "role-club", "skills", "resume", "contact", ...projectIds];
const sourceId = z.enum(sourceIds);
const sources = z.array(sourceId).max(8);
const text = z.string().min(1).max(4000);
export const chatInput = z.object({
  message: z.string().trim().min(1).max(LIMITS.message),
  history: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().trim().min(1).max(6000) }).strict()).max(LIMITS.history).default([]),
  projectId: z.enum(projectIds).nullable().default(null),
}).strict();
export const compareInput = z.object({ jobDescription: z.string().trim().min(40).max(LIMITS.job) }).strict();
export const chatOutput = z.object({ answer: text, sourceIds: sources.min(1) }).strict();
export const comparisonOutput = z.object({
  roleSummary: text,
  requirements: z.array(z.object({
    requirement: z.string().min(1).max(500),
    evidence: z.enum(["Direct evidence", "Related evidence", "Not established in the portfolio"]),
    explanation: z.string().min(1).max(1200),
    sourceIds: sources,
  }).strict()).min(1).max(10),
  projects: z.array(z.object({ sourceId: z.enum(projectIds), reason: z.string().min(1).max(700) }).strict()).max(5),
  clarification: z.array(z.string().min(1).max(700)).max(10),
  discussionTopics: z.array(z.string().min(1).max(500)).max(8),
}).strict();
export function validateOutput(mode, value) {
  const result = (mode === "chat" ? chatOutput : comparisonOutput).parse(value);
  if (JSON.stringify(result).length > LIMITS.outputBytes) throw new Error("Output too large");
  if (mode === "compare") {
    for (const item of result.requirements) {
      if (item.evidence !== "Not established in the portfolio" && !item.sourceIds.length) throw new Error("Missing evidence");
      if (item.evidence === "Not established in the portfolio" && item.sourceIds.length) throw new Error("Unsupported evidence label");
    }
  }
  return result;
}
export function safeDestination(href) {
  if (typeof href !== "string") return false;
  if (/^#(?:about|experience|skills|contact|projects|project-[1-5])$/.test(href)) return true;
  if (href === "/resume/Rohit_Resume.pdf") return true;
  try { const u = new URL(href); return u.protocol === "https:" && !u.username && !u.password; } catch { return false; }
}
