# Rohit Biradar — 3D Portfolio

A single-page React 19 portfolio built with Vite, Tailwind CSS, GSAP, and React Three Fiber. Sections cover profile, projects, experience, achievements, skills, Code Runner, résumé, testimonials, and contact.

Ask Rohit is a source-grounded AI guide to the published portfolio. Open it from the hero, floating launcher, a project card, or the résumé's job-description comparison action.

## Development

Use Node.js 22 or newer and npm.

```sh
npm install
npm run dev:api
```

In a second terminal:

```sh
npm run dev
```

Vite serves the site at http://localhost:5173 and proxies /api to the local Node server on 127.0.0.1:3001. Vite alone does not serve Vercel functions. The local API loads .env and .env.local. Keep existing EmailJS values; use .env.example as a reference for additional variables, not a replacement for your existing .env.

AI remains unavailable until the provider key, shared Redis protections, and explicit enable flag are configured. The portfolio and evidence links work without AI credentials. No generated answers are simulated.

## Validation

```sh
npm run lint
npm test
npm run test:browser
npm run build
npm run preview
```

Browser tests use installed Google Chrome (configurable in playwright.config.js), start local servers, and mock AI and EmailJS. They do not send real email. Node tests mock the provider and Redis. There is no TypeScript type-check command because this is a JavaScript project.

Production preview serves static files only; use the local frontend/API pair to exercise endpoints. A manual, one-request live check is available with `node scripts/live-smoke.js` after configuration. It reports a skip when configuration is missing.

## Deployment

Keep the existing Vercel Vite project: build command `npm run build`, output directory `dist`, Node.js 22 or newer. Root /api handlers deploy separately as Vercel functions. vercel.json sets a 60-second function duration. Add server variables in Vercel settings before enabling AI; no credentials should use a VITE_ prefix.

See [Ask Rohit setup and architecture](docs/ASK_ROHIT.md) for exact environment variables, quotas, local development, citations, and limitations. See [content gaps](docs/CONTENT_GAPS.md) before adding technical claims.

## Assets and motion

Both 3D scenes pause their render loops offscreen. Reduced-motion preferences disable scroll-entry animations and hero particles; the game animates during explicit play. Unsupported or failed 3D rendering has a text fallback. The assistant is a separate, lazy-loaded chunk and adds no 3D scene.

Project imagery, the résumé preview, portrait, AWS icon, and favicon have optimized derivatives. Originals remain for future editing. Run `npm run optimize:images` to regenerate them.

No Sentry integration, adaptive LOD, or measured 3G-load-time guarantee is claimed. The existing Three.js bundle remains substantial. See the architecture notes for performance limits.
