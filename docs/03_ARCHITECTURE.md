# 03 — Architecture

## Overall Architecture

Single **Next.js 14+ (App Router)** application deployed to Vercel, serving both the React frontend and the REST API via Route Handlers. No separate backend service. External managed services handle persistence, media, and AI inference.

```
                        ┌─────────────────────────────┐
                        │        Vercel (single)       │
                        │  ┌────────────┐ ┌──────────┐ │
   Browser  ───────────▶│  │  Next.js   │ │  Route    │ │
   (Buyer / Supplier)   │  │  App (SSR/ │ │  Handlers │ │
                        │  │  CSR pages)│ │  /app/api │ │
                        │  └────────────┘ └────┬─────┘ │
                        └──────────────────────┼───────┘
                                                │
              ┌─────────────────────────────────┼───────────────────────┐
              ▼                                 ▼                       ▼
     ┌──────────────────┐            ┌───────────────────┐   ┌────────────────────┐
     │  MongoDB Atlas    │            │   Cloudinary        │   │ Hugging Face        │
     │  (Mongoose ODM)   │            │  (product images)    │   │ Inference API        │
     └──────────────────┘            └───────────────────┘   └────────────────────┘
```

## Frontend

- **Next.js App Router** with a route group per experience: `app/(buyer)/...` and `app/(supplier)/...`, plus shared `app/(auth)/...`.
- **React Server Components** for data-heavy read views (product listing, dashboards) to reduce client JS; **Client Components** for interactive pieces (cart, forms, chat).
- **TailwindCSS + shadcn/ui** for consistent, fast-to-build UI primitives.
- **State management**: local React state + React Context for cart and auth session. No Redux/Zustand — unnecessary for this scope.
- **Form validation**: `react-hook-form` + shared `zod` schemas from `validations/`.

## Backend (API Layer)

- Implemented entirely as **Next.js Route Handlers** under `app/api/**/route.ts`, using the **Node.js runtime** (not edge, since Mongoose and Cloudinary SDKs need Node APIs).
- Each route handler is a thin controller: parse request → validate (Zod) → call a **service** function → return response. No business logic inside the route handler itself.
- Services live in `services/` and call **repositories** (`repositories/`) which encapsulate Mongoose queries. This keeps DB access swappable and testable without adding real complexity.

## API Layer Responsibilities

1. **Route Handler**: HTTP concerns only — method, status codes, auth guard, request parsing.
2. **Validation**: Zod schema parse/safeParse; return 400 with field errors on failure.
3. **Service**: business rules (e.g., "a supplier can only edit their own product", "cart quantity cannot exceed stock").
4. **Repository**: Mongoose model queries, no business rules.

## Database

- **MongoDB Atlas**, single cluster, single database for the hackathon.
- **Mongoose** schemas define collections: `users`, `buyerProfiles`, `supplierProfiles`, `products`, `carts`, `orders`. Full detail in `05_DATABASE.md`.

## AI Layer

- Isolated under `ai/` — never called directly from UI components or route handlers without going through an `ai/` service function.
- Calls the **Hugging Face Inference API** with a prompt built from: the user's message + relevant marketplace product data fetched via repository queries (simple keyword/category match, not a vector DB — out of scope for a 2-day build).
- Supports: conversational chat, natural language search (parses free text into filter parameters), recommendations, comparison, similar products, product Q&A. See `10_AI.md` for prompt flow.
- Voice input uses the browser's Web Speech API (or MediaRecorder + a lightweight client library) to transcribe to text client-side, then sends the resulting text through the same chat endpoint. No separate voice backend service.

## Authentication & Authorization

- **Auth.js (NextAuth) with Credentials provider** (or plain JWT — see `06_API_SPEC.md` for the chosen approach) issuing an HTTP-only session cookie.
- Every protected route handler checks session + role via a shared `lib/auth.ts` helper (`requireAuth(role)`).
- Middleware (`middleware.ts`) protects `app/(buyer)/dashboard` and `app/(supplier)/dashboard` route groups at the edge, redirecting unauthenticated users to login.

## Hosting

- **Vercel** hosts the entire application (frontend + API routes) as a single deployment.
- **MongoDB Atlas**, **Cloudinary**, and **Hugging Face Inference API** are external managed services connected via environment variables (see `13_DEPLOYMENT.md`).
- No Docker, no separate server, no background workers.

## Data Flow (Example: Buyer places an order)

1. Buyer adds products to cart → `POST /api/cart` → `cartService.addItem()` → `cartRepository` upserts cart document.
2. Buyer proceeds to checkout → client collects shipping info → `POST /api/orders` → `orderService.createOrder()` validates stock via `productRepository`, creates `orders` document with status `Pending`, decrements stock, clears cart.
3. Supplier dashboard polls/loads `GET /api/supplier/orders` → sees the new order.
4. Supplier updates status via `PATCH /api/supplier/orders/:id/status` → `orderService.updateStatus()` enforces allowed status transitions.
5. Buyer dashboard reflects updated status on next load of `GET /api/buyer/orders`.

No real-time layer (WebSockets) is used; status updates are reflected on page load/refetch, which is sufficient for a demo.
