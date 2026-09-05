# 18 — Error Handling

Repository-wide error handling policy, consistent with the API response format introduced in `15_CODING_STANDARDS.md`.

## Standard API Response Format

```json
// success (single resource)
{ "data": { "...": "..." } }

// success (list)
{ "data": { "items": [], "total": 0, "page": 1, "limit": 20 } }

// error
{ "error": { "message": "Human-readable summary", "fields": { "email": "Already registered" } } }
```

`fields` is present only for validation errors (400); omitted otherwise.

## HTTP Error Codes and Meaning

| Code | Case | Example |
|---|---|---|
| 400 | Validation failure, business rule violation (e.g., invalid status transition, quantity exceeds stock) | "Quantity exceeds available stock" |
| 401 | No/invalid session | "Not authenticated" |
| 403 | Authenticated but wrong role or not resource owner | "You do not own this product" |
| 404 | Resource does not exist | "Product not found" |
| 409 | Conflict | "Email already registered" |
| 500 | Unexpected/unhandled error | "Something went wrong" (generic, no internals leaked) |

Every route handler must map known failure cases to one of these codes explicitly — never let an unhandled exception fall through to a generic Next.js error page for an API route.

## Error Handling by Layer

### Route Handler (Controller)
- Wraps the call to the service layer in try/catch.
- Catches typed `AppError` (see below) and maps `error.statusCode` + `error.message`/`fields` directly to the response.
- Catches anything else as an unexpected error → log full details server-side, return generic 500 to the client.

### Service Layer
- Throws a small typed error class, e.g.:
  ```ts
  class AppError extends Error {
    constructor(public statusCode: number, message: string, public fields?: Record<string, string>) {
      super(message);
    }
  }
  ```
- Business rule violations documented in `09_BUSINESS_RULES.md` (invalid order status transition, insufficient stock, ownership violation) throw `AppError` with the appropriate status code (400/403/404) and a clear message.
- Services never catch-and-swallow errors from repositories; they let them propagate unless they need to translate a DB error into a more specific `AppError`.

### Repository Layer
- Lets Mongoose errors propagate naturally (e.g., `ValidationError`, duplicate key `E11000`).
- Optionally translates a duplicate-key error into an `AppError(409, "...")` at the repository boundary if that mapping is reused across services (e.g., duplicate email on user creation).

## Validation Errors

- Always produced by Zod's `safeParse` at the top of the route handler (or a shared `validateBody(schema, data)` helper in `lib/`).
- On failure, respond `400` with `fields` populated from `zodError.flatten().fieldErrors`.
- Validation always happens before any database access — no partial writes on invalid input.

## Database Errors

- Connection errors (`lib/db.ts` failing to connect) surface as a 500 with a generic message; log the actual Mongoose connection error server-side for debugging.
- Duplicate key errors (e.g., registering an already-used email) are mapped to 409 with a clear field-level message (`{ fields: { email: "Already registered" } }`).
- Cast errors (invalid ObjectId in a route param) are mapped to 400 ("Invalid id format") rather than leaking a raw Mongoose stack trace.

## AI Failures (Hugging Face)

- All Hugging Face Inference API calls in `lib/huggingface.ts` are wrapped in try/catch.
- On failure (timeout, rate limit, malformed model output), the corresponding `/api/ai/*` route returns a 200 with a graceful fallback payload rather than a hard error where reasonable, e.g.:
  - Chat: `{ data: { reply: "I'm having trouble answering right now — try browsing or searching directly." } }`
  - Search: fall back to a plain keyword search against `product.repository.ts` instead of the AI-interpreted filter.
  - Recommend/Similar: fall back to a simple category/price-proximity query (non-AI heuristic) so the section never renders empty due to an AI outage.
- The one exception: if the AI service is completely unreachable and no fallback is feasible for a given endpoint, return 502 with `{ error: { message: "AI assistant is temporarily unavailable" } }`.
- AI failures must never block or break core buyer flows (browsing, cart, checkout) — the AI layer is additive per `10_AI.md` and `03_ARCHITECTURE.md`.

## Cloudinary Failures

- Upload errors (invalid file, network failure, quota) in `/api/uploads/image` return 400 with a clear message ("Image upload failed, please try a smaller file" or similar); never silently proceed with a broken image URL.
- Product create/edit forms must handle a failed upload by keeping the user on the form with the error shown, not by saving a product with a missing image reference.

## Unexpected Errors

- Any error not explicitly anticipated is caught at the route handler boundary, logged server-side via `lib/logger.ts` with route + userId (if available) + stack trace, and returned to the client as a generic 500 (`{ error: { message: "Something went wrong. Please try again." } }`). Never leak stack traces or internal messages to the client.

## Client-Side Error Handling

- Every `fetch` call to an API route checks `response.ok`/`error` field and handles both network failures (fetch throws) and API-level errors (`{ error: {...} }` in a 200/4xx/5xx response) — treat both the same way at the UI level: show a message, don't crash.
- Form submissions surface `fields` errors inline next to the relevant `FormField` (see `08_COMPONENTS.md`); surface the top-level `message` as a toast or inline banner if no field mapping applies.

## Toast Strategy

- Use a single shared toast utility (shadcn/ui `toast` or equivalent) for:
  - Success confirmations (product saved, order placed, status updated).
  - Non-blocking errors that don't need a full-page state (e.g., "Failed to add to cart — try again").
- Do **not** use toasts for validation errors that have a clear field to attach to — show those inline instead.

## Fallback UI

- Each list-rendering page (product grid, orders, dashboard widgets) has three states: loading (skeleton, see `19_UI_GUIDELINES.md`), empty (friendly message + relevant CTA), and error (short message + a retry action). No page should render blank or throw a white screen on a failed fetch.
- Server Component pages that fail to fetch critical data render a minimal error boundary (`error.tsx` at the relevant route segment) rather than crashing the whole app.

## What This Document Does Not Cover

No centralized error-tracking service (e.g., Sentry) is set up — out of scope per `02_SCOPE.md`'s "no enterprise" constraints; server-side `console`/logger output is sufficient for a hackathon demo.
