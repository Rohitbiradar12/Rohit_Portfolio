import { expCards, projects, techStackImgs } from "../src/constants/index.js";
import { safeDestination, sourceIds } from "../shared/assistant.js";

// Only published descriptions and responsibilities are evidence. Logos are not evidence.
export const knowledge = [
  { id: "profile", label: "About Rohit", href: "#about", facts: ["Rohit Biradar is based in Boston.", "Computer Science degree from REVA University.", "The portfolio lists MS Computer Science at Northeastern University, Khoury College. No graduation date is established.", "Backend work on a loan management system serving African markets."] },
  { id: "experience", label: "Professional experience", href: "#experience", facts: ["Amazon Web Services: Software Development Engineer Intern, June 2026–September 2026.", "Torry Harris Integration Solutions: Software Engineer, March 2024–August 2025; Software Engineer Intern, September 2023–March 2024.", "REVA Developer's Club is university club experience, not established as commercial employment."] },
  ...expCards.map((role, i) => ({ id: ["role-aws", "role-engineer", "role-intern", "role-club"][i], label: ["SDE Intern · Amazon Web Services", "Software Engineer · Torry Harris", "Intern · Torry Harris", "REVA Developer's Club"][i], href: "#experience", facts: [role.title.trim(), role.date, i === 0 ? "Professional internship at Amazon Web Services, Redmond WA." : i === 3 ? "University club contribution." : "Professional role at Torry Harris Integration Solutions.", ...role.responsibilities] })),
  { id: "skills", label: "Published skills", href: "#skills", facts: ["Self-reported skills; listing alone does not establish production use or proficiency: " + techStackImgs.map(t => t.name).join(", ")] },
  ...projects.map(p => ({ id: "project-" + p.id, label: p.title, href: "#project-" + p.id, publicUrl: p.link, facts: [p.des, "Portfolio project. Academic vs personal classification, individual ownership, implementation trade-offs, and measured results are not established unless explicitly stated in this description."] })),
  { id: "resume", label: "Resume", href: "/resume/Rohit_Resume.pdf", facts: ["Published resume is available as a PDF. The PDF is a destination, not additional ingested evidence. Do not claim facts from its unread contents."] },
  { id: "contact", label: "Contact", href: "#contact", facts: ["Public contact email: biradar.roh@northeastern.edu.", "Use the portfolio contact form to reach Rohit. Availability and reply time are not guaranteed."] },
];
for (const entry of knowledge) {
  if (!sourceIds.includes(entry.id) || !safeDestination(entry.href) || (entry.publicUrl && !safeDestination(entry.publicUrl))) throw new Error("Invalid knowledge source");
}
const catalog = new Map(knowledge.map(({ id, label, href }) => [id, { id, label, href }]));
export function resolveSources(ids) {
  return [...new Set(ids)].map(id => {
    const source = catalog.get(id);
    if (!source) throw new Error("Unknown source");
    return source;
  });
}
export function contextFor(projectId) {
  return projectId ? knowledge.filter(k => k.id === projectId || ["profile", "contact", "resume"].includes(k.id)) : knowledge;
}
export function attachSources(mode, output) {
  if (mode === "chat") return { ...output, sources: resolveSources(output.sourceIds) };
  return { ...output, requirements: output.requirements.map(r => ({ ...r, sources: resolveSources(r.sourceIds) })), projects: output.projects.map(p => ({ ...p, source: resolveSources([p.sourceId])[0] })) };
}
