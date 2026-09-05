# 17 — Security (MVP Level Only)

Practical security for a 2-day hackathon prototype. No enterprise controls (no SSO, no audit logging, no WAF, no penetration-test tooling) — those are explicitly out of scope per `02_SCOPE.md`.

## Password Hashing

- Passwords are hashed with **bcrypt** (or `argon2` if the team prefers) before being stored in `users.passwordHash`. Never store or log plaintext passwords.
- Minimum password length: 8 characters, enforced in `validations/auth.schema.ts`.
- Compare passwords only via the hashing library's compare function — never manual string equality.

## JWT / Auth

- Session identity is carried either as an Auth.js session cookie or a signed JWT (final choice recorded in `03_ARCHITECTURE.md` / `06_API_SPEC.md`); either way, the token is **HTTP-only** and **Secure** in production, never accessible to client-side JavaScript.
- Tokens encode only `userId` and `role` — no sensitive data (password hash, email is acceptable but minimize payload).
- `AUTH_SECRET` is a long random value stored only in environment variables (see `13_DEPLOYMENT.md`), never committed.
- Token expiry: `JWT_EXPIRES_IN=7d` is acceptable for a hackathon demo; no refresh-token rotation is implemented (out of scope).

## Input Validation

- Every write endpoint validates its request body/query against the matching Zod schema in `validations/` **before** any service logic runs (see `09_BUSINESS_RULES.md` → Validation).
- Validation failures return 400 with field-level messages; the request never reaches the database layer.
- Client-side validation (via the same Zod schema) is a UX convenience only — it is never trusted as the security boundary. The server always re-validates.

## Role Authorization

- Every protected route handler checks the session's `role` server-side against the permission matrix in `09_BUSINESS_RULES.md` before performing the action. The client-sent role is never trusted.
- Ownership checks (a supplier editing only their own product, a buyer viewing only their own cart/orders) are enforced by scoping repository queries with the authenticated `userId`, not by trusting an id passed from the client alone.
- `middleware.ts` provides a first layer of route-group protection (redirect unauthenticated users), but the route handler itself is the actual authorization boundary — middleware is not a substitute for server-side checks.

## API Protection

- All mutating endpoints (`POST`/`PATCH`/`DELETE`) require a valid session; only read endpoints for public marketplace browsing (`GET /api/products`, `GET /api/products/:id`, `GET /api/categories`) are unauthenticated by design.
- CORS is left at Next.js defaults (same-origin) since the frontend and API share one deployment — no cross-origin API consumers are supported or needed.
- No API keys are exposed to the client; all external service calls (Cloudinary signed uploads, Hugging Face) happen server-side in Route Handlers/services, never directly from the browser.

## Image Upload Validation

- `POST /api/uploads/image` validates file MIME type (`image/jpeg`, `image/png`, `image/webp` only) and a max file size (e.g., 5MB) before forwarding to Cloudinary.
- The Cloudinary upload uses a **signed upload** generated server-side (never expose the raw `CLOUDINARY_API_SECRET` to the client).
- Product `images` array is capped at a small max count (see `23_CONSTANTS.md`), enforced both client-side (UX) and server-side (actual limit).

## Rate Limiting (Simple)

- No external rate-limiting service (no Redis) per scope. A minimal, in-memory best-effort limiter may be added to sensitive endpoints (`/api/auth/login`, `/api/auth/register`, `/api/ai/*`) to blunt obvious abuse during a public demo — e.g., a simple counter per IP with a short window, acceptable to reset on redeploy.
- This is a courtesy safeguard for the demo, not a production-grade defense, and must not grow into a larger infrastructure piece (no Redis, no distributed limiter — out of scope).

## Environment Variables & Secrets

- All secrets (`MONGODB_URI`, `AUTH_SECRET`, `CLOUDINARY_API_SECRET`, `HUGGINGFACE_API_KEY`) live only in Vercel environment variables / local `.env.local`, per `13_DEPLOYMENT.md`.
- `.env.local` is git-ignored; only `.env.example` (placeholders, no real values) is committed.
- Never log full environment variable values, even in error messages.

## XSS Prevention

- React escapes rendered content by default — never use `dangerouslySetInnerHTML` for user-supplied or AI-generated content (product descriptions, chat replies, Q&A answers). Render as plain text/React children.
- If any markdown-style AI output formatting is desired later, it must go through a sanitizing renderer — out of scope for this MVP, plain text rendering is sufficient.

## MongoDB / NoSQL Injection Prevention

- All queries go through **Mongoose** with schema-typed fields; never build raw query objects directly from unvalidated user input (e.g., never do `Model.find(req.body)` — always construct the query object explicitly from validated, typed fields).
- Zod validation upstream also blocks operator-injection payloads (e.g., a `$gt` object where a string is expected) since the schema enforces primitive types before the value ever reaches a Mongoose query.
- Search/filter query parameters (`q`, `category`, etc.) are validated as plain strings/enums before being used in `$text` search or `$in` filters.

## Explicitly Out of Scope

Per `02_SCOPE.md`: OAuth providers, audit logs, advanced rate limiting (Redis-backed), WAF, dependency vulnerability scanning pipelines, penetration testing, secrets rotation automation, and multi-factor authentication are not part of this MVP.
