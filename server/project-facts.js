export const projectFacts = {
  "project-1": {
    verified: [{ repo: "Rohitbiradar12/Kambaz_Labs", commit: "d23fcfb893ad7a09d0eb9d0635446ba61356a2df" }, { repo: "Rohitbiradar12/Kambaz-Node-Mongo", commit: "6435902f7b4f778726efd008cb9988a7c3e4ade0" }],
    keywords: {
      names: ["3d canvas", "canvas", "kambaz", "lms", "learning management", "cs5610", "course project"],
      tech: ["next.js", "nextjs", "react", "typescript", "tailwind", "node", "node.js", "express", "mongodb", "mongoose", "session", "rest api"],
    },
    summary:
      "Kambaz (titled \"3D Canvas Application\" on earlier versions of the portfolio): a Canvas-style learning management system built in Northeastern's CS5610 Web Development course. Solo work (all commits are Rohit's). The code has no 3D graphics or AI features.",
    links: "Live demo and front-end code are linked under the answer.",
    details: [
      "Screens mirror an LMS: dashboard of course cards, course home, modules, assignments with an assignment editor, grades, people, quizzes, calendar, inbox, account sign-in/sign-up/profile.",
      "Back end (a separate Node/Express repository) is a REST API with a DAO-and-routes layer per resource: users, courses, modules, assignments and enrollments.",
      "Data modelling: modules are embedded in course documents and updated with $push/$pull; enrollments link users and courses and are resolved with populate(); a seed script loads and validates sample data and is safe to re-run.",
      "Session-based sign-up, sign-in, sign-out and profile, with roles STUDENT, FACULTY and ADMIN; users can be filtered by role or name.",
      "The live demo is a later version of the course app and includes labs on React state and Express REST APIs.",
    ],
    stack: [
      { tech: "Next.js (App Router), React and TypeScript", use: "front-end pages and layouts for the LMS screens" },
      { tech: "Tailwind CSS", use: "styling" },
      { tech: "Node.js and Express", use: "the REST API for users, courses, modules, assignments and enrollments" },
      { tech: "MongoDB with Mongoose", use: "schemas and models, embedded modules, populated enrollments, seed data" },
      { tech: "express-session", use: "cookie sessions for sign-in and role-based access" },
    ],
  },
  "project-2": {
    verified: [{ repo: "Rohitbiradar12/WorkNest", commit: "fb5d21909569ea2e358b5fe28999e47692f428b8" }],
    keywords: {
      names: ["work-nest", "worknest", "work nest", "jira", "project management"],
      tech: ["next.js", "nextjs", "react", "typescript", "hono", "appwrite", "backblaze", "nodemailer", "tanstack", "shadcn", "tailwind", "zod", "recharts", "gemini", "kanban", "oauth", "mfa", "ai"],
    },
    summary:
      "WorkNest: a multi-company, Jira-style project-management web app. Two-person project built in December 2025 with Shravankumar Janawade (the repository started on his account).",
    links: "Live demo and code are linked under the answer.",
    details: [
      "Rohit's part, from his commits: responsive layout and mobile sidebar, dark mode and theme toggle, the sign-in/sign-up redesign, OAuth and email-verification fixes, password validation, kanban and timesheet fixes, the invite modal, and dashboard and navbar updates.",
      "Multi-tenant roles: a super admin creates companies and their admin; company admins manage users; workspaces have ADMIN, MANAGER and EMPLOYEE roles backed by a permission matrix; members join with invite codes.",
      "Tasks have statuses from backlog to done, priorities, subtasks, epics, story points, labels and estimates, shown as a table, a drag-and-drop kanban board (bulk position updates) or a calendar, with filters kept in the URL.",
      "Timesheets with a start/stop timer (starting one stops the running one), manual entries and a billable flag; threaded comments with mentions; an activity log; analytics dashboards comparing this month with last month.",
      "Authentication: email/password, GitHub and Google OAuth, email verification and optional one-time-code MFA by email.",
      "AI features: task descriptions generated with Google Gemini and project images generated with ImageKit's AI generation.",
      "Architecture: a single Hono API mounted inside Next.js at /api with 13 sub-routers, called through a typed RPC client wrapped in TanStack Query hooks; requests validated with Zod; per-request Appwrite sessions from an httpOnly cookie.",
    ],
    stack: [
      { tech: "Next.js 14, React and TypeScript", use: "app pages for auth, dashboards, workspaces, projects and tasks" },
      { tech: "Hono", use: "the API layer inside Next.js, with a typed RPC client" },
      { tech: "TanStack Query", use: "data fetching and caching around the API client" },
      { tech: "Zod and react-hook-form", use: "request validation and forms" },
      { tech: "Appwrite", use: "authentication, sessions and the database collections" },
      { tech: "Backblaze B2", use: "file storage with signed download links" },
      { tech: "Nodemailer", use: "verification, MFA and notification emails" },
      { tech: "Shadcn UI, Radix, Tailwind CSS and Framer Motion", use: "the component library, styling and animation" },
      { tech: "Recharts, react-big-calendar, @hello-pangea/dnd and TanStack Table", use: "analytics charts, calendar view, kanban drag and drop, table view" },
      { tech: "Google Gemini API and ImageKit", use: "AI task descriptions and AI project images" },
    ],
  },
  "project-3": {
    verified: [{ repo: "Rohitbiradar12/MoneyMates", commit: "1f074fac2cbd6d8fe34dbc32818bbd2a1e21e7f0" }],
    keywords: {
      names: ["moneymates", "money-mates", "money mates", "splitwise", "expense", "expenses"],
      tech: ["java", "spring boot", "spring", "jpa", "hibernate", "postgresql", "postgres", "redis", "caching", "cache", "lombok", "maven"],
    },
    summary:
      "MoneyMates: a Splitwise-style expense-sharing back end in Java and Spring Boot, built solo by Rohit in June 2025. It is a work in progress: the data model, group management and Redis caching are implemented; expenses, settlements, loans, a web API and a front end are planned in the README but not yet in the code.",
    links: "Code is linked under the answer (there is no live demo).",
    details: [
      "Data model (JPA entities): users; groups with many-to-many membership; expenses with a payer and a split type (equal, custom or percent); expense splits with the amount owed and payment status (unpaid, partially paid, fully paid); settlements between users; pairwise user balances.",
      "Group service: create and update groups and look them up by id or by member, with native SQL queries for membership checks and member counts.",
      "Caching: group lookups are cached in Redis through Spring Cache (@Cacheable and @CacheEvict) with a 10-minute time-to-live.",
      "DTOs and a mapper keep request/response shapes separate from the entities.",
    ],
    stack: [
      { tech: "Java 17 and Spring Boot 3.5", use: "the application and service layer" },
      { tech: "Spring Data JPA with PostgreSQL", use: "entities, repositories and native queries" },
      { tech: "Redis with Spring Cache", use: "caching group lookups with a 10-minute TTL" },
      { tech: "Lombok and Maven", use: "boilerplate reduction and the build" },
    ],
  },
  "project-4": {
    verified: [{ repo: "Rohitbiradar12/Call-Pilot", commit: "835a2fec2e9d4a5b9957fc3445159f208bf1c6ca" }],
    keywords: {
      names: ["callpilot", "call pilot", "call-pilot", "voice agent", "voice", "appointment", "hackathon", "hacknation", "2nd place", "second place", "prize", "won", "award", "awards"],
      tech: ["fastapi", "python", "elevenlabs", "twilio", "supabase", "google places", "google calendar", "calendar", "websocket", "websockets", "docker", "react", "vite", "zustand", "groq", "jwt", "ai", "llm"],
    },
    summary:
      "CallPilot: an AI voice agent that finds local service providers, phones several at once, negotiates a time, checks the user's Google Calendar and books the appointment, with a live dashboard. Two-person hackathon project built with Shravankumar Janawade; it won 2nd place at HackNation (2026).",
    links: "Live demo and code are linked under the answer.",
    details: [
      "Rohit's part, from his commits: the Supabase database layer and schema (users, providers, campaigns, calls, bookings with row-level security), saving data from the call orchestration, tool and webhook flows, webhook connectivity fixes, Supabase-backed sign-in, and front-end pages (landing, dashboard, settings, navbar, theme toggle, location picker).",
      "The rest of the codebase, including the call orchestration, voice-agent integration, negotiation and scoring logic and the remaining front-end pages, comes from his teammate's commits (most of the 20 commits are the teammate's).",
      "Flow: the React app starts a campaign; FastAPI runs one async task per service type; Google Places finds providers and the Distance Matrix API filters them by distance; providers are saved to Supabase; an ElevenLabs voice agent calls them in two waves (preferred providers first); mid-call the agent hits the backend's tool webhooks to check the calendar, confirm a booking or report no availability; a Google Calendar event is created and the booking saved; results are ranked and streamed live.",
      "Ranking: weighted score of availability 0.4, rating 0.3, distance 0.2 and preference 0.1 (adjustable), with a boost for preferred providers; an optimizer picks the best non-overlapping set of bookings across services, with a travel bonus.",
      "Negotiation: later calls are told the best offer so far and use it as leverage.",
      "Live dashboard over WebSockets: call status, transcripts, scores and a provider map. A spam-prevention mode routes calls to test numbers.",
      "The language model behind the voice agent is configured in ElevenLabs, outside the code; the code itself does not call Groq.",
    ],
    stack: [
      { tech: "React, Vite, Tailwind CSS, Zustand and Framer Motion", use: "the booking flow, live campaign state and animation" },
      { tech: "Google Maps (React)", use: "the location picker and provider map" },
      { tech: "Python with FastAPI, Pydantic and httpx", use: "the API, background campaign tasks and calls to external services" },
      { tech: "ElevenLabs Conversational AI", use: "the voice agent that holds the phone conversation and calls tool webhooks" },
      { tech: "Twilio", use: "phone numbers and outbound calls through ElevenLabs' Twilio integration" },
      { tech: "Google Places, Distance Matrix and Calendar APIs", use: "finding providers, distance filtering, checking availability and creating events" },
      { tech: "Supabase (PostgreSQL)", use: "storing users, providers, campaigns, calls and bookings" },
      { tech: "WebSockets", use: "streaming live call updates to the dashboard" },
      { tech: "JWT", use: "the app session after Google sign-in" },
      { tech: "Docker", use: "packaging the Python back end" },
    ],
  },
  "project-5": {
    verified: [{ repo: "Rohitbiradar12/CogAgent-Marketplace", commit: "ba101b75995e85bab141e62e340cf2382a5a52d8" }],
    keywords: {
      names: ["cogagent", "cog agent", "cogcoin", "cog", "marketplace", "bitcoin", "hackathon", "swarm", "oracle", "people's choice", "peoples choice", "prize", "won", "award", "awards"],
      tech: ["node", "node.js", "express", "socket.io", "supabase", "claude", "anthropic", "allium", "bitcoinjs", "react", "vite", "zustand", "blockchain", "crypto", "web3", "ai", "llm", "agents"],
    },
    summary:
      "CogAgent Marketplace: an AI-agent marketplace driven by live Bitcoin data, built for the MIT Bitcoin Hackathon 2026 by Rohit and Shravan Janwade (about half the commits each); it won the People's Choice award there. Agents are hired, ranked and composed into swarms, and users compete in Cogcoin \"proof-of-language\" sentence rounds tied to each new Bitcoin block.",
    links: "Live demo and code are linked under the answer.",
    details: [
      "Rohit's part, from his commits: the front-end shell (API client, Socket.IO connection, Zustand store, router), the mining visualizer, competition, oracle, swarm and trigger pages and dashboard panels, the Allium live-Bitcoin integration, wiring the swarm task executor to Socket.IO, Supabase schema and seed updates, and the Vercel deployment fix. The rest of the code comes from his teammate's commits.",
      "Live Bitcoin data: the server polls the Allium SQL API for the latest block height and hash, BTC/ETH prices, transaction counts, fees and Cogcoin OP_RETURN outputs; each new block starts new mining and competition rounds.",
      "Cogcoin: the @cogcoin/scoring library assigns five words from the block hash, scores sentences and encodes them. COG balances, escrow and payments are tracked in the database rather than as on-chain transactions.",
      "Agent swarms: Claude splits a task into 3–5 subtasks with dependencies and budgets; the server validates the graph (cycle detection, budget check) and runs ready subtasks in parallel waves, releasing payment per finished subtask.",
      "Marketplace ranking blends skill match, reputation, job history and price. Oracles: three oracle agents report prices, and consensus takes the median, drops outliers beyond 2% and computes a confidence score. Triggers: if/then rules on oracle data that transfer funds, post jobs or start swarms.",
      "Realtime UI over Socket.IO; the Express server uses helmet, a CORS allowlist, rate limiting and XSS sanitisation.",
    ],
    stack: [
      { tech: "React, Vite, React Router, Zustand, Tailwind CSS, Radix and Framer Motion", use: "the dashboard, marketplace, mining, competition, oracle, swarm and trigger pages" },
      { tech: "react-force-graph and Recharts", use: "the agent network graph and score charts" },
      { tech: "Node.js, Express and Socket.IO (JavaScript)", use: "the REST API and realtime block, mining and swarm events" },
      { tech: "Supabase (PostgreSQL)", use: "agents, jobs, balances and rounds" },
      { tech: "Allium API", use: "live Bitcoin block and price data" },
      { tech: "Anthropic Claude API", use: "breaking tasks into subtasks and doing agent work in swarms" },
      { tech: "bitcoinjs-lib", use: "testnet keys and addresses for agents and Cogcoin-format OP_RETURN payloads" },
      { tech: "@cogcoin/scoring", use: "scoring and encoding the sentences" },
    ],
  },
};

// Roles reuse the published responsibilities in src/constants; these add retrieval keywords,
// the kind of role and its technologies (as listed on the Experience section).
export const roleFacts = {
  "role-aws": {
    kind: "Professional internship at Amazon Web Services, Redmond WA.",
    stack: ["Amazon Bedrock", "ECS Fargate", "AWS CDK", "CloudFront", "DynamoDB", "KMS", "Python", "MCP"],
    keywords: {
      names: ["aws", "amazon", "amazon web services", "pas ai insights", "aurora", "internship", "experience", "professional", "job", "career"],
      tech: ["bedrock", "ecs", "fargate", "cdk", "cloudfront", "dynamodb", "kms", "python", "mcp", "agentic", "ai", "llm", "hammerdb", "sysbench", "cloud"],
    },
  },
  "role-engineer": {
    kind: "Professional role at Torry Harris Integration Solutions, Bangalore, on a loan management system for African markets.",
    stack: ["Java", "Spring Boot", "Kafka", "Redis", "PostgreSQL", "Oracle", "REST and SOAP APIs", "shell scripting"],
    keywords: {
      names: ["torry harris", "torry", "loan", "loan management", "experience", "professional", "job", "career"],
      tech: ["spring boot", "spring", "kafka", "redis", "postgresql", "postgres", "oracle", "java", "rest", "soap", "microservices", "shell", "smtp", "backend", "caching"],
    },
  },
  "role-intern": {
    kind: "Professional internship at Torry Harris Integration Solutions, Bangalore.",
    stack: ["Java", "Spring Boot", "JWT", "AWS S3", "API Gateway", "microservices"],
    keywords: {
      names: ["torry harris", "torry", "intern", "lms", "learning management"],
      tech: ["spring boot", "spring", "jwt", "s3", "api gateway", "microservices", "java", "authentication", "security", "auth"],
    },
  },
  "role-club": {
    kind: "University club contribution (REVA Developer's Club), not commercial employment.",
    stack: ["REST APIs", "database design", "role-based access control", "pagination", "logging"],
    keywords: {
      names: ["reva", "club", "developer's club", "university"],
      tech: ["rest", "rbac", "role-based", "pagination", "database", "api"],
    },
  },
};
