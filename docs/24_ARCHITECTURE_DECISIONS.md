# 24 — Architecture Decision Records (ADRs)

Every major architectural decision, so future contributors (human or AI agent) don't reopen settled debates. Format: Decision → Reason → Alternative Considered → Why Rejected → Impact.

---

### ADR-01: Next.js Route Handlers instead of a separate Express backend

- **Decision**: All backend logic lives in Next.js Route Handlers under `app/api/`.
- **Reason**: Single codebase, single deployment target (Vercel), zero extra infrastructure to configure in a 2-day window; the hackathon brief explicitly mandates this.
- **Alternative Considered**: Separate Express/Node backend with its own deployment.
- **Why Rejected**: Doubles deployment/config overhead (CORS, separate env vars, separate hosting), adds no functional benefit at this scale, and directly contradicts the hackathon's "single deployment" requirement.
- **Impact**: Backend logic must stay modular within the Next.js app (`services/`, `repositories/`) to avoid becoming a tangle of route-handler-embedded logic — enforced by `15_CODING_STANDARDS.md`.

---

### ADR-02: MongoDB (Atlas) as the database

- **Decision**: MongoDB Atlas, accessed via Mongoose.
- **Reason**: Flexible schema fits evolving product `specifications`/`colors` fields well during rapid iteration; free managed tier requires no ops work; explicitly listed as an accepted option in the hackathon brief.
- **Alternative Considered**: PostgreSQL/MySQL (also listed as acceptable in the brief).
- **Why Rejected**: Relational schema migrations add friction during fast iterative changes typical of a hackathon; document model maps naturally onto `Product`/`Order` shapes without join complexity for this feature set.
- **Impact**: No relational joins/transactions across collections beyond what Mongoose `.populate()` and simple multi-step service logic provide — acceptable given order/product relationships are shallow.

---

### ADR-03: Mongoose as the ODM

- **Decision**: Mongoose for schema definition and queries.
- **Reason**: Provides schema validation, typed models, and a well-known query API, reducing boilerplate versus the raw MongoDB driver.
- **Alternative Considered**: Raw MongoDB Node driver; Prisma (with Mongo connector).
- **Why Rejected**: Raw driver loses schema validation convenience; Prisma's Mongo support and generated-client workflow add setup overhead not justified for a 2-day build.
- **Impact**: All DB access goes through Mongoose models in `models/`, queried only from `repositories/` per `04_FOLDER_STRUCTURE.md`.

---

### ADR-04: Vercel as the sole hosting platform

- **Decision**: Single Vercel deployment for the whole app.
- **Reason**: Zero-config Next.js deployment, free tier sufficient for a demo, mandated by the hackathon brief.
- **Alternative Considered**: Render, Railway, a VPS.
- **Why Rejected**: Explicitly excluded by the hackathon brief ("No Render. No Railway. No VPS."); would also require a split deployment for frontend/backend, contradicting ADR-01.
- **Impact**: All Node-dependent code (Mongoose, Cloudinary, Hugging Face calls) must run under the Node.js runtime in Route Handlers, not the Edge runtime — see `13_DEPLOYMENT.md`.

---

### ADR-05: Cloudinary for image storage

- **Decision**: Cloudinary handles all product image uploads/hosting.
- **Reason**: Managed service with a generous free tier, built-in image optimization/CDN delivery, no server-side file storage needed on Vercel (which is ephemeral/serverless).
- **Alternative Considered**: Storing images directly in MongoDB (base64/GridFS); AWS S3.
- **Why Rejected**: MongoDB storage bloats documents and query performance for no benefit; S3 requires additional IAM/bucket configuration overhead not justified when Cloudinary's free tier and simpler signed-upload flow suffice, and the hackathon brief specifies Cloudinary directly.
- **Impact**: `lib/cloudinary.ts` centralizes all upload logic; `POST /api/uploads/image` is the only path that writes images, per `06_API_SPEC.md` and `17_SECURITY.md`.

---

### ADR-06: Hugging Face Inference API for AI features

- **Decision**: All AI features (chat, search, recommend, compare, similar, Q&A) call the Hugging Face Inference API.
- **Reason**: Hackathon brief explicitly prefers a custom LLM from Hugging Face over a third-party proprietary API; no separate model-hosting infrastructure needed since Hugging Face hosts inference.
- **Alternative Considered**: OpenAI/Anthropic API; self-hosted model.
- **Why Rejected**: Contradicts the hackathon brief's stated preference; self-hosting a model is infeasible within a 2-day timeframe and Vercel's serverless constraints.
- **Impact**: `lib/huggingface.ts` is the single integration point; all AI logic is isolated in `ai/` and `services/ai.service.ts` per `03_ARCHITECTURE.md` and `10_AI.md`, so the model/provider could be swapped later without touching UI or route handlers.

---

### ADR-07: Feature-first folder structure

- **Decision**: Organize by feature (`features/`) for client composition, layered by responsibility (`services/`, `repositories/`, `models/`) for backend logic, rather than a single flat `src/` or strict domain-driven-design module boundary.
- **Reason**: Balances discoverability (a developer can find everything about "cart" in one place) with the layered separation the hackathon brief explicitly requires (UI / business logic / database / API / AI layers kept distinct).
- **Alternative Considered**: Fully domain-modular (each domain owns its own models/services/components in one folder); flat structure with no feature grouping.
- **Why Rejected**: Fully domain-modular adds indirection not worth it at this codebase size; fully flat structure makes navigation harder as the number of files grows across 20+ endpoints and pages.
- **Impact**: New code must be placed per `04_FOLDER_STRUCTURE.md`'s directory responsibilities — enforced by `14_AGENT_RULES.md` rules 14–18.

---

### ADR-08: No separate Express server

- **Decision**: No Express (or any other Node HTTP framework) anywhere in the stack.
- **Reason**: Next.js Route Handlers already provide full REST API capability; adding Express would mean running two servers or awkwardly mounting Express inside a Next.js custom server, both of which complicate the single-Vercel-deployment goal.
- **Alternative Considered**: Express behind a Next.js custom server.
- **Why Rejected**: Custom servers disable several Vercel/Next.js optimizations and add operational complexity for zero functional gain here.
- **Impact**: See ADR-01.

---

### ADR-09: No Docker

- **Decision**: No containerization.
- **Reason**: Vercel deployment doesn't require or benefit from Docker; MongoDB Atlas/Cloudinary/Hugging Face are all managed external services needing no local container orchestration.
- **Alternative Considered**: Dockerized local dev environment for consistency.
- **Why Rejected**: Adds setup time and a new tool to learn/maintain within a 2-day window for a benefit (environment parity) that a simple `.env.example` + `npm install` already covers adequately.
- **Impact**: Local dev is just `npm install && npm run dev` against a shared or personal Atlas cluster.

---

### ADR-10: No Redis

- **Decision**: No Redis or other external cache/queue.
- **Reason**: No background jobs, no session store beyond JWT/cookie, no caching need beyond what Next.js's built-in `fetch` caching and Cloudinary's CDN already provide at this scale.
- **Alternative Considered**: Redis for session storage or rate limiting.
- **Why Rejected**: Adds an external managed service and connection config for a problem the hackathon's traffic/data scale doesn't actually have.
- **Impact**: Rate limiting (see `17_SECURITY.md`) uses a best-effort in-memory approach instead; sessions are stateless JWTs/cookies.

---

### ADR-11: No WebSockets

- **Decision**: No real-time transport; all updates (e.g., order status changes) are reflected on next page load/refetch.
- **Reason**: The core workflows (checkout, order status updates) don't require sub-second real-time propagation for a demo; polling/refetch-on-navigation is sufficient and far simpler to implement correctly.
- **Alternative Considered**: WebSocket or Server-Sent Events channel for live order status updates.
- **Why Rejected**: Adds a persistent-connection layer, reconnection handling, and Vercel serverless-compatibility concerns not justified by the requirement.
- **Impact**: UI must explicitly refetch relevant data after mutations (`16_STATE_MANAGEMENT.md` → Data Revalidation) rather than relying on push updates.

---

### ADR-12: No Microservices

- **Decision**: Single monolithic Next.js application for the entire system.
- **Reason**: Two roles, ~25 endpoints, and one shared database do not warrant service decomposition; a monolith is faster to build, deploy, and reason about within the timeframe.
- **Alternative Considered**: Splitting buyer/supplier/AI concerns into separate deployable services.
- **Why Rejected**: Massively increases operational complexity (multiple deployments, inter-service auth, network calls) for zero benefit at this scale, and directly contradicts the single-deployment mandate.
- **Impact**: Internal modularity (services/repositories/features) provides the separation of concerns a microservice split would otherwise be used to enforce, without the deployment overhead.

---

## Adding a New ADR

Any future architectural decision (new external service, new hosting target, new major library) must be recorded here with the same five fields before being adopted, and must not conflict with `02_SCOPE.md`'s Out of Scope list without an explicit, documented scope change approved against the original hackathon brief.
