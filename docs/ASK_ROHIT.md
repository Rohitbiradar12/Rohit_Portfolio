# Ask Rohit

## Architecture

The existing Vite/React application stays intact. There is no framework migration or vector database.

- `src/assistant/AssistantHost.jsx`: lightweight launcher and portal shell. The panel and schema code load only on first open. Closing hides the mounted panel, preserving this page session.
- `src/assistant/AssistantPanel.jsx`: question and comparison modes, sources, retry/cancel, memory-only state.
- `src/assistant/client.js`: bounded SSE reader, interrupted-response handling, client schema validation.
- `shared/assistant.js`: strict Zod input/output schemas, source IDs, centralized limits.
- `server/knowledge.js`: approved context and server-owned source destinations. Reuses existing project descriptions, roles/responsibilities, and skills.
- `server/provider.js`: OpenAI-compatible JavaScript SDK pointed at Groq Chat Completions with strict JSON-schema output. No tools, browsing, filesystem access, or code execution.
- `server/handler.js`: POST-only API, request limits, fail-closed configuration, quotas, timeouts, disconnect cancellation, safe errors.
- `server/rate-limit.js`: shared Upstash Redis quotas using one atomic Lua reservation.
- `api/chat.js` and `api/compare.js`: Vercel Node handlers.
- `src/hooks/useDialog.js`: Escape, focus trap/restoration, scroll lock, inert background shared with navigation and contact dialogs.
- `scripts/dev-api.js`: loopback local server for the same handlers.

Groq returns a complete structured response; the server validates the full payload and source IDs before returning it. The UI shows progress while generating, not partial tokens. Token-by-token display can be added later with an API/model path that supports streaming structured outputs. Comparison returns validated JSON. There are zero automatic provider retries and no model-repair loop; visitors may retry explicitly.

## Required configuration

Append these server-only values to .env.local locally, and to Vercel environment settings for the environments you intend to enable:

| Variable | Purpose |
| --- | --- |
| GROQ_API_KEY | API key from your Groq Console |
| UPSTASH_REDIS_REST_URL | HTTPS REST URL of your existing Upstash Redis database (*.upstash.io) |
| UPSTASH_REDIS_REST_TOKEN | Read/write REST token; atomic EVAL must be permitted |
| ASK_ROHIT_IP_SALT | Random secret of at least 32 characters for hashing rate-limit identities |
| ASK_ROHIT_ENABLED | Set to true only after the above protections and quotas are ready |

Generate a salt locally with:

```sh
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Do not share keys in chat, commit them, or prefix them with VITE_. Existing VITE_APP_EMAILJS_* values are intentionally public EmailJS identifiers and remain separate. .env.example contains empty placeholders; it does not modify existing credentials.

No infrastructure or paid subscription is created by this repository. Configure or choose your own provider/Redis accounts. Until then, 503 responses show an honest unavailable state with experience, project, and résumé links. Redis outages also fail closed.

## Optional configuration and cost bounds

| Variable | Default | Maximum accepted |
| --- | --- | --- |
| GROQ_MODEL | openai/gpt-oss-120b | Choose a Groq model supporting strict structured outputs |
| ASK_ROHIT_CHAT_PER_HOUR | 15 per IP | 100 |
| ASK_ROHIT_COMPARE_PER_HOUR | 4 per IP | 20 |
| ASK_ROHIT_DAILY_REQUESTS | 100 globally | 1,000 |
| ASK_ROHIT_MONTHLY_REQUESTS | 1,000 globally | 10,000 |

Counters are shared across instances and all deployments using the same database/key namespace. UTC hour/day/month windows are used. Reservation is atomic across per-IP and global limits, so concurrent invocations cannot exceed the configured counts. Failed or cancelled provider calls still consume reservations. Global exhaustion may deny everyone; this is an intentional spending safeguard. Per-IP limits are imperfect against distributed abuse; the global quota still bounds accepted requests.

Vercel uses its edge-managed x-vercel-forwarded-for header. Local development uses the loopback socket address, not client-supplied forwarded headers. Revisit this trust model before hosting elsewhere. Redis stores only counters and daily salted HMAC identifiers, with expiration (hour: 1h; day: 24h; month: 32d). It stores no conversations or job descriptions.

Chat input is 2,000 characters; comparison is 12,000 characters (minimum 40). At most 12 prior messages; the browser further trims history to fit the 48,000-byte body limit. Output JSON is limited to 24,000 bytes; output tokens are capped at 2,500 for chat and 5,000 for comparison, including model reasoning. Provider execution has a 45-second deadline and zero automatic retries; Redis has a 4-second timeout. Browser timeout is 55 seconds; Vercel function limit is 60 seconds.

Request quotas plus token caps bound usage, not a fixed dollar total across arbitrary models. Set conservative values, review the chosen model's current pricing, and configure provider project spending controls/alerts too. Changing the model changes costs and may require adjusting reasoning settings in provider.js. Keep a kill switch: ASK_ROHIT_ENABLED=false.

## Local frontend and backend

```sh
npm install
npm run dev:api
# separate terminal:
npm run dev
```

Visit http://localhost:5173. Restart the API process after server/env changes. Vite proxies /api to port 3001. The API binds only to loopback. Vercel's `vercel dev` is another option if you already have the CLI and a linked project, but it is not required for local checks.

For deployment, retain Vercel's Vite preset, dist output, and root /api directory. Configure environment variables in the Vercel dashboard and use Node.js 22 or newer. This implementation does not publish, push, link a Vercel account, or provision resources. After your own deployment, check /api/chat and /api/compare on the preview domain; function bundling, real Redis, and real provider behavior still require that smoke check.

## Evidence and updates

Update existing data in src/constants/index.js for project descriptions, roles, and skill names. The backend imports those fields; it does not infer technologies from iconLists. Profile facts and source metadata live in server/knowledge.js. Each evidence entry must have a stable ID from shared/assistant.js and a verified public destination.

The resume PDF is a source destination, not parsed model context. No claims are extracted from its filename or preview. Existing professional role responsibilities are used verbatim; university-club work is explicitly distinguished from commercial employment. Portfolio project classification and individual ownership remain unknown unless documented.

For a new project: add its approved public description, extend project/source IDs, add a matching #project-N anchor, update the client source catalogue, and test source navigation. Do not reorder role data without updating stable role-ID mappings. Ask Rohit currently uses general portfolio context for every question; project-specific scoping is disabled in the interface.

Sources are returned as server-validated IDs and links. The browser independently maps known IDs to its own fixed link catalogue and never renders model-provided URLs. #project-N navigation reveals the actual carousel card, closes the panel, and focuses the destination. External resume links open separately. Text is rendered through React as plain text, including apparent Markdown/HTML.

Review docs/CONTENT_GAPS.md before adding architecture, trade-off, ownership, availability, or metric claims.

## Privacy and security boundaries

No prompt, job description, provider key, or raw IP is logged by application code. Conversations and pasted descriptions are kept in React state only and disappear on reload. New conversation clears both modes. Closing cancels active requests and keeps prior content. Existing Code Runner score storage is unrelated.

Groq receives submitted text and the approved context. Check Groq current data policy before sending sensitive content; conversations are not stored by this application. Hosting/platform request metadata may still be logged by the platform.

Untrusted job text and history are serialized in a user message, never inserted into trusted instructions. Client system/developer roles and extra fields are rejected. All output is schema checked, source IDs are allowlisted, and the model has no tools or credentials in its context. Prompt instructions reduce but cannot guarantee immunity to semantic hallucination or prompt injection; citations validate destinations, not factual entailment. Human evidence review and live evaluation remain necessary.

## Testing

- npm test: deterministic Node tests with mocked Groq-compatible completions and Redis.
- npm run test:browser: headless Google Chrome UI checks, mocked AI/email; local servers started automatically.
- npm run lint: ESLint across browser, shared, server, scripts and tests.
- npm run build: production frontend compilation and chunking.
- node scripts/live-smoke.js: one administrative provider request if configured; otherwise explicit skip. This manual script bypasses public route quotas and costs at most one configured request.
- tests/evaluation.json: semantic evaluation set for supported experience, project scope, follow-ups, false premises, confidential-data requests, transcript/JD injection and related/unrelated roles. Mock tests do not establish live model quality.

No TypeScript type-check command applies. Browser configuration defaults to installed Chrome; use a supported Playwright channel or install Playwright Chromium if your machine does not have Chrome.

## Known limitations

No live model or external quota-store verification is possible without credentials. No external project links or resume contents were fact-checked by the assistant. The existing Three.js initial bundle is large; assistant code remains a separate lazy-loaded chunk. Original images remain in public for editing and therefore still occupy deployment storage, although the page uses smaller derivatives. The former 8,775-line stylesheet is split into ordered modules under src/styles, imported by src/index.css. The split preserves every existing top-level rule and its order; legacy visual rules remain rather than being deleted speculatively. Assistant styles stay separately lazy loaded. The game remains a frame-based canvas game and is not a screen-reader-equivalent experience.
