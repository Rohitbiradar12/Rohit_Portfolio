import { test, expect } from "@playwright/test";
const answer = { answer: "Rohit worked on Spring Boot loan services and Kafka workflows.", sourceIds: ["role-engineer", "project-4"] };
const respond = (route, value = answer) => route.fulfill({ contentType: "text/event-stream", body: "event: status\ndata: {\"message\":\"Checking evidence\"}\n\nevent: result\ndata: " + JSON.stringify(value) + "\n\n" });
const openRo = async (page, item = "Chat with Ro") => { await page.getByRole("button", { name: "Ask Ro", exact: true }).click(); await page.getByRole("menuitem", { name: new RegExp(item) }).click(); };
test.beforeEach(async ({ page }) => { await page.goto("/"); });
test("desktop lazy loading, focus trap, session persistence, sources and reset", async ({ page }) => {
  const loaded = await page.evaluate(() => performance.getEntriesByType("resource").map(r => r.name));
  expect(loaded.some(url => url.includes("AssistantPanel"))).toBe(false);
  await page.route("**/api/chat", route => respond(route));
  const launcher = page.getByRole("button", { name: "Ask Ro", exact: true });
  await openRo(page);
  const dialog = page.getByRole("dialog", { name: "Ask Ro" });
  await expect(dialog).toBeVisible();
  await expect(page.getByRole("button", { name: /Give me a 30-second overview/ })).toBeVisible();
  await expect(page.locator(".ar-welcome h3")).toBeInViewport();
  await page.screenshot({ path: "test-results/ask-rohit-desktop.png" });
  await expect(page.getByRole("button", { name: "Close Ask Ro" })).toBeFocused();
  await page.keyboard.press("Shift+Tab"); await expect(page.locator("#ar-question")).toBeFocused();
  await page.getByRole("button", { name: /Give me a 30-second overview/ }).click();
  await expect(dialog.getByText(answer.answer)).toBeVisible();
  await page.keyboard.press("Escape"); await expect(dialog).toBeHidden(); await expect(launcher).toBeFocused();
  await openRo(page); await expect(dialog.getByText(answer.answer)).toBeVisible();
  await expect(dialog.getByRole("link", { name: "CallPilot code" })).toHaveAttribute("href", "https://github.com/Rohitbiradar12/Call-Pilot");
  await dialog.getByRole("link", { name: "CallPilot", exact: true }).click();
  await expect(dialog).toBeHidden(); await expect(page.locator("#project-4")).toBeInViewport();
  await openRo(page); await dialog.getByRole("button", { name: "New conversation" }).click();
  await expect(dialog.getByText(answer.answer)).toHaveCount(0);
});
test("AI is launched only from the floating button; project context control is removed", async ({ page }) => {
  await expect(page.getByRole("button", { name: /Ask AI about my work/ })).toHaveCount(0);
  await expect(page.locator(".pj-ai-button, .resume-ai-action")).toHaveCount(0);
  await openRo(page);
  await expect(page.locator("#ar-project")).toHaveCount(0);
  await page.getByRole("button", { name: "Compare a role" }).click();
  await expect(page.locator("#ar-job")).toBeVisible();
  await page.getByRole("button", { name: /Try an example/ }).click();
  await expect(page.locator("#ar-job")).toHaveValue(/SAMPLE BACKEND ROLE/);
});test("unconfigured API offers honest fallback and portfolio remains usable", async ({ page }) => {
  await page.route('**/api/chat', route => route.fulfill({ status: 503, json: { code: 'unavailable', message: 'The AI guide is not available right now.' } }));
  await openRo(page);
  await page.getByRole("button", { name: /Give me a 30-second overview/ }).click();
  await expect(page.getByRole("alert")).toContainText("not available");
  await expect(page.getByRole("dialog", { name: "Ask Ro" }).getByRole("link", { name: /Resume/ })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("#contact input[name=email]")).toBeAttached();
});
test("mobile sheet fits viewport and tablet navigation is accessible", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openRo(page);
  await expect(page.locator(".ro-root")).not.toHaveAttribute("data-docked"); // no room beside a full-screen chat
  const bounds = await page.getByRole("dialog", { name: "Ask Ro" }).boundingBox();
  expect(bounds.x).toBe(0); expect(bounds.y).toBe(0); expect(bounds.width).toBe(390); expect(bounds.height).toBe(844);
  await expect(page.getByRole("button", { name: /Give me a 30-second overview/ })).toBeVisible();
  await page.screenshot({ path: "test-results/ask-rohit-mobile.png" });
  await page.getByRole("button", { name: "Close Ask Ro" }).click();
  await page.setViewportSize({ width: 900, height: 900 });
  await page.getByRole("button", { name: "Toggle mobile menu" }).click();
  const menu = page.getByRole("dialog", { name: "Navigation menu" });
  await expect(menu).toBeVisible(); await expect(page.getByRole("button", { name: "Close menu" })).toBeFocused();
  await page.keyboard.press("Escape"); await expect(page.getByRole("button", { name: "Toggle mobile menu" })).toBeFocused();
});
test("game does not steal Enter from other controls; input supports multiline", async ({ page }) => {
  const button = page.getByRole("button", { name: "Ask Ro", exact: true });
  await button.focus(); await page.keyboard.press("Enter");
  await expect(page.getByRole("menuitem", { name: /Chat with Ro/ })).toBeFocused(); await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog", { name: "Ask Ro" })).toBeVisible();
  await page.locator("#ar-question").fill("First line"); await page.keyboard.press("Shift+Enter"); await page.keyboard.type("Second line");
  await expect(page.locator("#ar-question")).toHaveValue("First line\nSecond line");
});
test("HTML stays text; interrupted stream retries without duplicate visitor messages", async ({ page }) => {
  let calls = 0;
  await page.route("**/api/chat", route => {
    calls++;
    return calls === 1 ? route.fulfill({ contentType: "text/event-stream", body: 'event: status\ndata: {"message":"Working"}\n\n' }) : respond(route, { answer: '<img src=x onerror="window.injected=true">', sourceIds: ["profile"] });
  });
  await openRo(page);
  await page.locator("#ar-question").fill("Tell me about Rohit"); await page.keyboard.press("Enter");
  await expect(page.getByRole("alert")).toContainText("interrupted");
  await page.getByRole("button", { name: /Retry request/ }).click();
  await expect(page.locator(".ar-assistant")).toContainText("<img");
  expect(await page.evaluate(() => window.injected)).toBeUndefined();
  await expect(page.locator(".ar-user")).toHaveCount(1);
});
test("comparison renders evidence and source links, never a match score", async ({ page }) => {
  await page.route("**/api/compare", route => route.fulfill({ json: { roleSummary: "Sample Java backend role.", requirements: [{ requirement: "Java services", evidence: "Direct evidence", explanation: "Published Spring Boot responsibilities.", sourceIds: ["role-engineer"] }, { requirement: "Rust", evidence: "Not established in the portfolio", explanation: "No published evidence.", sourceIds: [] }], projects: [{ sourceId: "project-4", reason: "AI voice agent." }], clarification: ["Ask about deployment ownership."], discussionTopics: ["Discuss Kafka workflows."] } }));
  await openRo(page, "Match a role");
  await page.getByRole("button", { name: /Try an example/ }).click();
  await page.getByRole("button", { name: /Compare experience/ }).click();
  await expect(page.locator(".ar-report")).toContainText("Direct evidence");
  await expect(page.locator(".ar-report")).toContainText("Not established in the portfolio");
  await expect(page.locator(".ar-report")).not.toContainText("%");
  await page.screenshot({ path: "test-results/ask-rohit-comparison.png" });
});
test("cancel and duplicate submission controls", async ({ page }) => {
  let calls = 0;
  await page.route("**/api/chat", async route => { calls++; await new Promise(resolve => setTimeout(resolve, 1500)); await respond(route).catch(() => {}); });
  await openRo(page);
  await page.locator("#ar-question").fill("Backend experience?");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("button", { name: "Send question" })).toHaveCount(0); // send turns into stop while Ro answers
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("cancelled");
  expect(calls).toBe(1);
});
test("email acknowledgement failure preserves primary success and dialog focus", async ({ page }) => {
  let calls = 0;
  await page.route("https://api.emailjs.com/**", route => { calls++; return route.fulfill({ status: calls === 1 ? 200 : 500, contentType: "text/plain", body: calls === 1 ? "OK" : "ERROR" }); });
  await page.locator("#name").fill("Browser test");
  await page.locator("#email").fill("test@example.com");
  await page.locator("#message").fill("Mocked delivery test; no real email.");
  await expect(page.locator("#name")).toHaveValue("Browser test");
  await expect(page.locator("#email")).toHaveValue("test@example.com");
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Message sent" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Continue", exact: true })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Send message", exact: true })).toBeFocused();
  expect(calls).toBe(2);
});

test("normal-motion page and project controls remain usable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.reload();
  await expect(page.getByRole("button", { name: "Ask Ro", exact: true })).toBeVisible();
  await page.locator("#projects").scrollIntoViewIfNeeded();
  await expect(page.locator("#project-1 .pj-main-link")).toHaveAttribute("href", "https://kambaz-a6-labs.vercel.app/");
  await page.getByRole("button", { name: "Next project" }).click();
  await expect(page.locator(".pj-ai-button")).toHaveCount(0);
  await page.keyboard.press("Escape");
  await page.screenshot({ path: "test-results/portfolio-projects.png" });
});
test("Ro menu is keyboard operable and routes to chat, role match, the dance and the game", async ({ page }) => {
  const ro = page.getByRole("button", { name: "Ask Ro", exact: true });
  await ro.focus(); await page.keyboard.press("Enter");
  await expect(ro).toHaveAttribute("aria-expanded", "true");
  const items = page.getByRole("menuitem");
  await expect(items).toHaveCount(4);
  await page.keyboard.press("ArrowDown"); await expect(items.nth(1)).toBeFocused();
  await page.keyboard.press("ArrowUp"); await page.keyboard.press("ArrowUp"); await expect(items.nth(3)).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("menu")).toHaveCount(0); await expect(ro).toBeFocused();
  await openRo(page, "Match a role");
  await expect(page.locator("#ar-job")).toBeVisible();
  await page.keyboard.press("Escape"); await expect(ro).toBeFocused();
  await openRo(page, "Play a game");
  await expect(page.locator("#game canvas")).toBeFocused();
  await expect(page.locator("#game")).toBeInViewport();
});
test("Ro docks beside the open chat and returns home when it closes", async ({ page }) => {
  const ro = page.locator(".ro-root");
  const home = await ro.boundingBox();
  await openRo(page);
  await expect(ro).toHaveAttribute("data-docked", "true");
  const panel = await page.locator("#ask-rohit-dialog").boundingBox();
  // The reduced-motion stylesheet turns style changes into 0.01ms transitions that finish on the next frame.
  await expect.poll(async () => { const box = await ro.boundingBox(); return box.x + box.width; }).toBeLessThanOrEqual(panel.x);
  const docked = await ro.boundingBox();
  expect(docked.x + docked.width).toBeGreaterThan(panel.x - 40);
  await page.keyboard.press("Escape");
  await expect(ro).not.toHaveAttribute("data-docked");
  await expect.poll(() => ro.boundingBox()).toEqual(home);
  await expect(page.getByRole("button", { name: "Ask Ro", exact: true })).toBeFocused();
});
test("a project's ask button scopes the opening question to that project", async ({ page }) => {
  let body;
  await page.route("**/api/chat", route => { body = route.request().postDataJSON(); return respond(route, { answer: "CallPilot is a voice agent.", sourceIds: ["project-4"] }); });
  await page.getByRole("button", { name: "Ask AI about CallPilot" }).click();
  await expect(page.getByRole("dialog", { name: "Ask Ro" }).getByText("CallPilot is a voice agent.")).toBeVisible();
  expect(body).toMatchObject({ projectId: "project-4", history: [] });
  expect(body.message).toContain("CallPilot");
});
test("awards index links each public record and keeps details readable on phones", async ({ page }) => {
  const rows = page.locator("#achievements .aw-row");
  await expect(rows).toHaveCount(6);
  await expect(rows.nth(0).locator(".aw-prize")).toHaveText("People's Choice");
  await expect(rows.nth(1).locator(".aw-prize")).toHaveText("2nd Place");
  await expect(page.getByRole("link", { name: /Verify: Azure Fundamentals/ })).toHaveAttribute("href", /credly\.com\/badges\//);
  for (const link of await page.locator("#achievements .aw-proof[href]").all()) {
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await rows.first().scrollIntoViewIfNeeded();
  await expect(rows.first().locator(".aw-line")).toBeVisible();
  const width = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(width).toBeLessThanOrEqual(390);
});

test("Ro dances on request, then takes a bow; with reduced motion it only beams", async ({ page }) => {
  const root = page.locator(".ro-root");
  await openRo(page, "Make Ro dance");
  await expect(root).toHaveAttribute("data-dancing", "");
  await expect(page.locator(".ro-notes")).toHaveCount(0); // reduced motion: no notes, no moves
  await expect(page.getByRole("status").filter({ hasText: "thank you, thank you" })).toBeVisible({ timeout: 5000 });
  await expect(root).not.toHaveAttribute("data-dancing", "");

  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.reload();
  await openRo(page, "Make Ro dance");
  await expect(page.locator(".ro-notes i")).toHaveCount(4);
  await expect.poll(() => page.locator(".ro-visual").evaluate((el) => el.style.transform), { timeout: 5000 }).toContain("translate3d(");
  await expect(page.getByRole("status").filter({ hasText: "thank you, thank you" })).toBeVisible({ timeout: 15000 });
  await expect(page.locator(".ro-notes")).toHaveCount(0);
});
