import { projectFacts } from "../server/project-facts.js";

const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "portfolio-facts-check",
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};
let changed = 0;
for (const [id, facts] of Object.entries(projectFacts)) {
  for (const { repo, commit } of facts.verified) {
    const res = await fetch(`https://api.github.com/repos/${repo}/compare/${commit}...HEAD`, { headers });
    if (!res.ok) {
      const hint = res.status === 403 || res.status === 429 ? " (rate limited: try later or set GITHUB_TOKEN)" : "";
      console.log(`?  ${id}  ${repo}: GitHub returned ${res.status}${hint}`);
      continue;
    }
    const diff = await res.json();
    if (diff.status === "identical") {
      console.log(`✓  ${id}  ${repo}: up to date`);
      continue;
    }
    changed++;
    console.log(`✗  ${id}  ${repo}: ${diff.ahead_by} new commit(s) since ${commit.slice(0, 7)}${diff.behind_by ? ` (history rewritten: ${diff.behind_by} verified commit(s) gone)` : ""}`);
    for (const c of diff.commits.slice(-10))
      console.log(`     ${c.commit.author.date.slice(0, 10)}  ${c.commit.author.name}: ${c.commit.message.split("\n")[0]}`);
    const files = (diff.files || []).map((f) => f.filename);
    console.log(`     files changed (${files.length}): ${files.slice(0, 12).join(", ")}${files.length > 12 ? ", …" : ""}`);
  }
}
console.log(
  changed
    ? `\n${changed} repository(ies) changed. Review those projects in server/project-facts.js, then set their verified commit to the new HEAD.`
    : "\nRo's project facts match the latest code.",
);
