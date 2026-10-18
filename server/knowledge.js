import { expCards, projects, techStackImgs } from "../src/constants/index.js";
import { safeDestination, sourceIds } from "../shared/assistant.js";
import { projectFacts, roleFacts } from "./project-facts.js";

// Only published descriptions, responsibilities and facts verified in the public repositories are
// evidence. Logos are not evidence. Every entry has short `facts` that are always sent; `details`
// are sent only when a question is about that entry (see contextFor), so requests stay small.
export const knowledge = [
  {
    id: "profile",
    label: "About Rohit",
    href: "#about",
    facts: [
      "Rohit Biradar is a software engineer based in Boston.",
      "Computer Science degree from REVA University.",
      "The portfolio lists MS Computer Science at Northeastern University, Khoury College. No graduation date is established.",
      "Professional focus: backend services (Java, Spring Boot, Kafka, Redis, SQL) and, at AWS, agentic AI on Amazon Bedrock.",
      "Rohit's code is public on GitHub; each project's code and live demo links appear under answers that cite the project.",
    ],
  },
  {
    id: "experience",
    label: "Professional experience",
    href: "#experience",
    facts: [
      "Amazon Web Services: Software Development Engineer Intern, June 2026–September 2026.",
      "Torry Harris Integration Solutions: Software Engineer, March 2024–August 2025; Software Engineer Intern, September 2023–March 2024.",
      "REVA Developer's Club is university club experience, not established as commercial employment.",
    ],
  },
  ...expCards.map((role, i) => {
    const id = ["role-aws", "role-engineer", "role-intern", "role-club"][i];
    return {
      id,
      label: ["SDE Intern · Amazon Web Services", "Software Engineer · Torry Harris", "Intern · Torry Harris", "REVA Developer's Club"][i],
      href: "#experience",
      keywords: roleFacts[id].keywords,
      facts: [role.title.trim() + ", " + role.date + ". " + roleFacts[id].kind, "Technologies: " + roleFacts[id].stack.join(", ") + "."],
      details: role.responsibilities,
    };
  }),
  {
    id: "skills",
    label: "Published skills",
    href: "#skills",
    facts: [
      "Self-reported skills; listing alone does not establish production use or proficiency: " + techStackImgs.map((t) => t.name).join(", "),
      "Where a skill was actually used is shown by the roles and projects that list it in their technologies.",
    ],
  },
  ...projects.map((p) => {
    const f = projectFacts["project-" + p.id];
    return {
      id: "project-" + p.id,
      label: p.title,
      href: "#project-" + p.id,
      publicUrl: p.link,
      keywords: f.keywords,
      facts: [f.summary, "Technologies: " + f.stack.map((s) => s.tech).join(", ") + ".", f.links],
      details: [...f.details, ...f.stack.map((s) => `${s.tech}: ${s.use}`)],
    };
  }),
  {
    id: "resume",
    label: "Resume",
    href: "/resume/Rohit_Resume.pdf",
    facts: [
      "Published resume is available as a PDF. The PDF is a destination, not additional ingested evidence. Do not claim facts from its unread contents.",
    ],
  },
  {
    id: "contact",
    label: "Contact",
    href: "#contact",
    facts: [
      "Public contact email: biradar.roh@northeastern.edu.",
      "Use the portfolio contact form to reach Rohit. Availability and reply time are not guaranteed.",
    ],
  },
];
for (const entry of knowledge) {
  if (
    !sourceIds.includes(entry.id) ||
    !safeDestination(entry.href) ||
    (entry.publicUrl && !safeDestination(entry.publicUrl))
  )
    throw new Error("Invalid knowledge source");
}
const catalog = new Map(
  knowledge.map(({ id, label, href }) => [id, { id, label, href }]),
);
export function resolveSources(ids) {
  return [...new Set(ids)].map((id) => {
    const source = catalog.get(id);
    if (!source) throw new Error("Unknown source");
    return source;
  });
}

// Lightweight retrieval: score roles and projects by how strongly the question names them
// (names and aliases) or their technologies, and expand the best few with their details.
const normalise = (text) => " " + text.toLowerCase().replace(/[^a-z0-9+#.]+/g, " ") + " ";
const mentions = (text, keyword) => {
  const term = normalise(keyword).trim();
  return text.includes(" " + term + " ") || (term.length > 4 && text.includes(term));
};
function relevance(entry, text) {
  let score = 0;
  for (const name of entry.keywords.names) if (mentions(text, name)) score += 6;
  for (const tech of entry.keywords.tech) if (mentions(text, tech)) score += 2;
  return score;
}
export function contextFor(projectId, query = "", mode = "chat") {
  const pick = (entry, expand) => ({ id: entry.id, label: entry.label, facts: expand ? [...entry.facts, ...(entry.details || [])] : entry.facts });
  if (projectId)
    return knowledge
      .filter((k) => k.id === projectId || ["profile", "contact", "resume"].includes(k.id))
      .map((k) => pick(k, k.id === projectId));
  const text = normalise(query);
  const ranked = knowledge
    .filter((k) => k.keywords)
    .map((k) => ({ id: k.id, score: relevance(k, text) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
  // A job description touches many technologies, so compare mode always expands the professional roles.
  const expanded = new Set(ranked.slice(0, mode === "compare" ? 2 : 3).map((r) => r.id));
  if (mode === "compare") ["role-aws", "role-engineer", "role-intern"].forEach((id) => expanded.add(id));
  return knowledge.map((k) => pick(k, expanded.has(k.id)));
}
export function attachSources(mode, output) {
  if (mode === "chat")
    return { ...output, sources: resolveSources(output.sourceIds) };
  return {
    ...output,
    requirements: output.requirements.map((r) => ({
      ...r,
      sources: resolveSources(r.sourceIds),
    })),
    projects: output.projects.map((p) => ({
      ...p,
      source: resolveSources([p.sourceId])[0],
    })),
  };
}
