# 27 — Project Roadmap (Implementation Progress)

This is **not** a future-feature roadmap — no new scope is defined here. It's a checklist mirror of `11_DEVELOPMENT_PLAN.md`'s phases so developers and AI agents can mark real progress without touching scope. Check items off as they're completed and verified per `25_DEVELOPER_CHECKLIST.md`.

## Phase 0 — Project Setup

- [ ] Next.js (App Router, TypeScript) initialized
- [ ] Tailwind + shadcn/ui installed and configured
- [ ] Mongoose, Auth.js/JWT, react-hook-form, zod, Cloudinary SDK, Hugging Face client installed
- [ ] `lib/db.ts` connection singleton working
- [ ] `.env.example` created
- [ ] Base `app/layout.tsx` and Tailwind config in place
- [ ] Deploys to Vercel (blank app)

## Phase 1 — Auth & Roles

- [ ] `User` model
- [ ] `auth.schema.ts`, `auth.service.ts`, `user.repository.ts`
- [ ] `POST /api/auth/register`
- [ ] `POST /api/auth/login`
- [ ] `POST /api/auth/logout`
- [ ] Login/Register pages
- [ ] `middleware.ts` route protection
- [ ] **Checkpoint verified**: register/login/logout works for both roles; protected routes redirect correctly

## Phase 2 — Onboarding

- [ ] `BuyerProfile` / `SupplierProfile` models
- [ ] `onboarding.schema.ts`, `onboarding.service.ts`
- [ ] `POST /api/onboarding/buyer`
- [ ] `POST /api/onboarding/supplier`
- [ ] Onboarding UI (buyer)
- [ ] Onboarding UI (supplier)
- [ ] **Checkpoint verified**: new users are routed through onboarding exactly once and land on the correct home

## Phase 3 — Product Catalog & Supplier Inventory

- [ ] `Product` model, schema, repository, service
- [ ] Supplier product CRUD endpoints
- [ ] `POST /api/uploads/image`
- [ ] Supplier inventory list/add/edit UI
- [ ] `GET /api/products` (search + filter + pagination)
- [ ] `GET /api/products/:id`
- [ ] `GET /api/categories`
- [ ] Marketplace landing page
- [ ] Product listing page
- [ ] Product detail page
- [ ] **Checkpoint verified**: supplier-created product with images appears correctly in buyer-facing listing/detail with working search/filter

## Phase 4 — Cart & Checkout

- [ ] `Cart` model, schema, repository, service
- [ ] `/api/cart` endpoints (GET/POST/PATCH/DELETE)
- [ ] Cart page
- [ ] `Order` model, schema, repository, service
- [ ] `POST /api/orders`
- [ ] Checkout flow pages (shipping → summary → review → confirmation)
- [ ] **Checkpoint verified**: buyer can add to cart, check out without payment, see confirmed order

## Phase 5 — Dashboards & Order Management

- [ ] `GET /api/buyer/orders`, `GET /api/buyer/profile`
- [ ] Buyer dashboard UI
- [ ] `GET /api/supplier/dashboard`
- [ ] `GET /api/supplier/products`, `GET /api/supplier/orders`
- [ ] `PATCH /api/supplier/orders/:id/status`
- [ ] `GET/PATCH /api/supplier/profile`
- [ ] Supplier dashboard + order management UI
- [ ] Status transition enforcement verified (forward-only, per `09_BUSINESS_RULES.md`)
- [ ] **Checkpoint verified**: full order loop works end-to-end with status visible on both sides

## Phase 6 — AI Assistant

- [ ] `lib/huggingface.ts`
- [ ] `ai/context-builder.ts`
- [ ] `ai/prompts/*` (chat, search, recommend, compare, qa)
- [ ] `services/ai.service.ts`
- [ ] `POST /api/ai/chat`
- [ ] `POST /api/ai/search`
- [ ] `POST /api/ai/recommend`
- [ ] `POST /api/ai/compare`
- [ ] `GET /api/ai/similar`
- [ ] `POST /api/ai/qa`
- [ ] `ChatWidget` + `VoiceInputButton` components
- [ ] `ComparisonPanel`, `ProductQnA`, `SimilarProducts` components
- [ ] AI grounded in real DB data (verified, not hardcoded)
- [ ] AI failure fallback behavior verified (per `18_ERROR_HANDLING.md`)
- [ ] **Checkpoint verified**: chat, NL search, recommendations, comparison, similar products, Q&A all functional against real data

## Phase 7 — Responsive Polish & Bonus

- [ ] Mobile/tablet pass on every buyer page
- [ ] Mobile/tablet pass on every supplier page
- [ ] Loading/empty/error states on every list view
- [ ] Form validation error states verified
- [ ] Toast strategy implemented consistently
- [ ] Bonus (only if time remains, per `02_SCOPE.md`):
  - [ ] Conversational/voice onboarding polish
  - [ ] Voice response for AI assistant
  - [ ] Minor animations/skeleton polish
  - [ ] Accessibility pass beyond basics

## Phase 8 — Deployment & Demo Prep

- [ ] Final Vercel deployment with all env vars configured
- [ ] Seed data loaded (`22_SEED_DATA.md`)
- [ ] Full `12_TESTING.md` checklist run
- [ ] Demo video recorded (buyer journey, supplier journey, AI features)
- [ ] Live deployed URL confirmed working end-to-end
- [ ] Submission materials assembled per hackathon brief's Submission Instructions

## Notes for Whoever Updates This File

- Check off an item only after it's been verified per `25_DEVELOPER_CHECKLIST.md`, not merely coded.
- Do not add new checklist items for features outside `02_SCOPE.md` — if something new seems worth doing, raise it as a scope discussion first, it does not belong on this list until approved.
- This file changes frequently and is expected to; it carries no architectural authority — `02_SCOPE.md`, `06_API_SPEC.md`, and `05_DATABASE.md` remain the source of truth for what things should look like.
