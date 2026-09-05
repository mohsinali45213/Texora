# 11 — Development Plan

Each phase ends with a runnable application. Designed for a 2-day (roughly 16–20 working hour) build.

## Phase 0 — Project Setup (~1 hr)

- Initialize Next.js (App Router, TypeScript) project.
- Install Tailwind, shadcn/ui, Mongoose, Auth.js/jsonwebtoken, react-hook-form, zod, Cloudinary SDK, Hugging Face inference client.
- Set up `lib/db.ts` (Mongoose connection singleton), `.env.example`, base `app/layout.tsx`, Tailwind config.
- Push initial commit to Git.
- **Runnable checkpoint**: blank Next.js app builds and deploys to Vercel successfully.

## Phase 1 — Auth & Roles (~2 hrs)

- `User` model, `auth.schema.ts`, `auth.service.ts`, `user.repository.ts`.
- `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`.
- Login/Register pages, session handling, `middleware.ts` route protection.
- **Runnable checkpoint**: a user can register as buyer or supplier, log in, log out, and protected routes redirect correctly.

## Phase 2 — Onboarding (~2 hrs)

- `BuyerProfile` / `SupplierProfile` models, `onboarding.schema.ts`, `onboarding.service.ts`.
- `/api/onboarding/buyer`, `/api/onboarding/supplier`.
- Onboarding UI (form-based first; conversational polish deferred to bonus pass).
- **Runnable checkpoint**: new users are redirected to onboarding and, once completed, land on their respective home (marketplace or supplier dashboard).

## Phase 3 — Product Catalog & Supplier Inventory (~3 hrs)

- `Product` model, `product.schema.ts`, `product.repository.ts`, `product.service.ts`.
- Supplier: `/api/products` (POST), `/api/products/:id` (PATCH/DELETE), `/api/uploads/image`, inventory list/add/edit UI.
- Buyer: `/api/products` (GET list w/ search+filter), `/api/products/:id` (GET), `/api/categories`.
- Marketplace landing page, product listing page, product detail page.
- **Runnable checkpoint**: a supplier can create a product with images; it appears in the public marketplace listing and detail page with working search/filter.

## Phase 4 — Cart & Checkout (~2.5 hrs)

- `Cart` model, `cart.schema.ts`, `cart.repository.ts`, `cart.service.ts`.
- `/api/cart` (GET/POST/PATCH/DELETE), cart page.
- `Order` model, `order.schema.ts`, `order.repository.ts`, `order.service.ts`.
- `/api/orders` (POST/GET), checkout flow pages (shipping → summary → review → confirmation).
- **Runnable checkpoint**: a buyer can add products to cart, check out without payment, and see a confirmed order.

## Phase 5 — Dashboards & Order Management (~2.5 hrs)

- Buyer: `/api/buyer/orders`, `/api/buyer/profile`, dashboard UI (profile, current/past orders).
- Supplier: `/api/supplier/dashboard`, `/api/supplier/products`, `/api/supplier/orders`, `/api/supplier/orders/:id/status`, `/api/supplier/profile`, dashboard + order management UI.
- Status transition enforcement per `09_BUSINESS_RULES.md`.
- **Runnable checkpoint**: full buyer-to-supplier order loop works end-to-end, including status progression visible on both sides.

## Phase 6 — AI Assistant (~3 hrs)

- `lib/huggingface.ts`, `ai/context-builder.ts`, `ai/prompts/*`.
- `services/ai.service.ts` and all `/api/ai/*` routes: chat, search, recommend, compare, similar, qa.
- `ChatWidget`, `VoiceInputButton`, `ComparisonPanel`, `ProductQnA`, `SimilarProducts` components wired into buyer pages.
- **Runnable checkpoint**: buyer can chat with the assistant, get grounded recommendations/comparisons/similar products/Q&A, and use natural language search.

## Phase 7 — Responsive Polish & Bonus (~2 hrs)

- Pass over every page at mobile/tablet breakpoints.
- Loading/empty states, form validation error states, toasts.
- Bonus items from `02_SCOPE.md` only if time remains: conversational onboarding polish, voice response, minor animations, accessibility pass.
- **Runnable checkpoint**: app is fully responsive and demo-ready.

## Phase 8 — Deployment & Demo Prep (~1.5 hrs)

- Final Vercel deployment with all env vars configured (`13_DEPLOYMENT.md`).
- Seed a small realistic dataset (a handful of suppliers/products) for a smooth demo.
- Run through the full manual testing checklist (`12_TESTING.md`).
- Record demo video walking through both buyer and supplier journeys plus AI features.

## Ordering Rationale

Auth and product catalog are prerequisites for everything else, so they come first. Cart/checkout/orders form the core transactional loop and are prioritized over AI, since AI is explicitly a bonus/enhancement layer per the hackathon brief, even though it is required functionality — the core buyer/supplier loop must work independently of AI at every stage.
