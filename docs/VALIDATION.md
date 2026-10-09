# Validation record

Completed locally on 2026-09-30. No commit, push, deployment, real email, or paid infrastructure was created.

- `npm run lint`: passed with no errors or warnings.
- `npm test`: 12 deterministic tests passed (mocked Groq-compatible completions and quota storage).
- `npm run test:browser`: 10 headless Google Chrome tests passed. Desktop, 390px mobile, and 900px tablet viewports; both reduced and normal motion were exercised.
- Browser coverage: lazy loading, the floating assistant launcher, absence of hero/project/resume AI entry buttons, removed project context control, focus trap/Escape/restoration, session persistence, reset, carousel source navigation, unconfigured backend fallback, safe HTML-as-text, interrupted-stream retry, duplicate submission prevention, cancellation, structured comparison rendering, normal-motion project controls, and primary email success despite acknowledgement failure.
- `npm run build`: passed. Ask Rohit panel is a separate approximately 96 KB JS chunk (29 KB gzip) and 7 KB CSS chunk. Existing main bundle remains approximately 1.50 MB (477 KB gzip).
- Build warnings: large existing Three.js/main bundle, third-party lottie eval warning, and removable Zod pure-annotation comments.
- `git diff --check`: passed (Git emits local LF/CRLF conversion notices).
- Local source asset-reference scan: no missing referenced image/model/resume assets.
- Browser bundle scan: no server credential variable names or server configuration included.
- CSS split: all 1,029 prior top-level rules/blocks preserved in the same order across 13 imported modules.
- Screenshots inspected: desktop assistant, mobile assistant, comparison report, and normal-motion project cards. Test screenshots are local ignored files under test-results/.
- `node scripts/live-smoke.js`: explicitly skipped because live provider configuration was unavailable.

The comparison/answer fixtures are test-only mocks, not model-quality evidence. The semantic evaluation set in tests/evaluation.json has not been run against a live model. Real Redis, Groq behavior, external destination availability and Vercel deployment remain unverified.

npm installation reported 15 dependency advisories (3 low, 3 moderate, 9 high). No broad dependency upgrades were applied. A later offline audit returned no cached findings; that is not evidence of a clean online audit. Review a fresh `npm audit` before deployment and handle any necessary dependency upgrades separately.

## Official implementation references

Checked during implementation:

- [Groq structured outputs with the OpenAI-compatible JavaScript SDK](https://console.groq.com/docs/structured-outputs)
- [Groq structured-output limitations](https://console.groq.com/docs/structured-outputs)
- [Groq GPT-OSS 120B model and rate limits](https://console.groq.com/docs/rate-limits)
- [Vercel Node.js functions](https://vercel.com/docs/functions/runtimes/node-js)
- [Vercel trusted request headers](https://vercel.com/docs/headers/request-headers)
- [Upstash Redis REST API](https://upstash.com/docs/redis/features/restapi)
