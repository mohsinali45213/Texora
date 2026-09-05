# 15 — Coding Standards

Applies to all code in this repository, human- or AI-agent-written. See `14_AGENT_RULES.md` for the non-negotiable scope/architecture rules this document assumes.

## TypeScript Rules

- `strict: true` in `tsconfig.json`. No `any` unless justified with a comment explaining why (e.g., a third-party type gap).
- Prefer `interface` for object shapes that may be extended (models, API payloads), `type` for unions/utility compositions.
- All function parameters and return types are explicitly typed for exported functions; inference is fine for short local helpers.
- Shared types live in `types/`; do not redefine the same shape in multiple files — import it.
- Mongoose documents use a typed schema (`Model<IUser>` pattern) so repository functions return typed objects, not `any`.

## Naming Conventions

| Kind | Convention | Example |
|---|---|---|
| React component | PascalCase | `ProductCard.tsx` |
| Hook | camelCase, `use` prefix | `useCart.ts` |
| Service function | camelCase, verb-first | `createOrder()`, `updateProductStock()` |
| Repository function | camelCase, CRUD-verb-first | `findById()`, `insertOne()`, `updateStatus()` |
| Route handler file | fixed name `route.ts` | `app/api/products/route.ts` |
| Mongoose model | PascalCase singular | `Product`, `Order` |
| Zod schema | camelCase, `Schema` suffix | `createProductSchema` |
| Type/interface | PascalCase, `I` prefix optional but consistent within a file | `Product`, `IProduct` |
| Constant | SCREAMING_SNAKE_CASE | `LOW_STOCK_THRESHOLD` |
| Boolean variable/prop | `is`/`has`/`can` prefix | `isAvailable`, `hasStock` |

Pick one convention per category and apply it everywhere — do not mix `IProduct` and `Product` for the same entity across files.

## Folder Conventions

Follow `04_FOLDER_STRUCTURE.md` exactly. Quick reference:

- UI-only, reusable → `components/`
- Feature-scoped client composition → `features/<feature>/`
- Business logic → `services/`
- DB access → `repositories/`
- Schemas → `models/` (Mongoose) and `validations/` (Zod)
- Cross-cutting infra clients → `lib/`
- AI-specific logic → `ai/`

## File Naming

- React component files: `PascalCase.tsx` matching the exported component name.
- Non-component TypeScript files: `camelCase.ts` (e.g., `productRepository.ts` or `product.repository.ts` — pick one suffix style and apply it repo-wide; this suite uses `product.repository.ts`, `product.service.ts`, `product.schema.ts`).
- Route handlers are always `route.ts` inside a folder named for the resource/action, per Next.js App Router conventions.
- Test/checklist artifacts (if any ad hoc scripts are added) go in `scripts/`, never in `app/`.

## React Conventions

- Functional components only, no class components.
- Default export for page/layout components (Next.js requirement); named exports for everything in `components/`.
- Props typed via an explicit `interface <Component>Props`.
- Keep components focused: if a component exceeds ~150 lines or handles more than one clear responsibility, split it.
- No inline business logic in JSX event handlers beyond simple state updates or calling a hook/service function — see `16_STATE_MANAGEMENT.md`.

## Next.js Conventions

- Default to **Server Components**. Add `"use client"` only when the component needs interactivity, browser APIs, or hooks like `useState`/`useEffect`.
- Data fetching for read-only pages happens in Server Components (direct repository/service calls or `fetch` to internal API), not in `useEffect`.
- Route Handlers always declare `export const runtime = "nodejs"` when using Mongoose, Cloudinary, or Hugging Face SDKs (see `13_DEPLOYMENT.md`).
- Route Handlers are thin: parse → validate → call service → respond. No Mongoose calls directly inside `route.ts`.

## Import Ordering

Group and order imports as follows, with a blank line between groups:

1. External packages (`react`, `next/*`, `mongoose`, third-party libs)
2. Internal absolute imports (`@/lib/...`, `@/services/...`, `@/components/...`)
3. Relative imports (`./`, `../`)
4. Type-only imports last within their group, or use `import type` inline

Use the `@/*` path alias (configured in `tsconfig.json`) for all internal imports outside the current folder; avoid deep relative paths like `../../../lib/db`.

## Error Handling

See `18_ERROR_HANDLING.md` for the full policy. In short:

- Route handlers wrap service calls in try/catch and translate known errors (validation, not-found, forbidden) into the standard API error shape; unexpected errors return a generic 500 without leaking internals.
- Services throw typed errors (e.g., a small `AppError` class with `statusCode` and `message`) rather than returning `null`/`undefined` ambiguously.
- Never swallow errors silently (`catch {}` with no handling).

## Async Patterns

- `async/await` everywhere; no raw `.then()` chains.
- Every `await` that can fail is inside a try/catch at the appropriate boundary (usually the route handler or a top-level service function).
- Parallelize independent awaits with `Promise.all` (e.g., fetching dashboard stats).
- No floating promises — always `await` or explicitly `void` a fire-and-forget call with a comment explaining why.

## API Response Format

Standard success and error shapes (see `06_API_SPEC.md` and `18_ERROR_HANDLING.md` for full detail):

```json
// success
{ "data": { } }

// list success
{ "data": { "items": [], "total": 0, "page": 1, "limit": 20 } }

// error
{ "error": { "message": "string", "fields": { "field": "reason" } } }
```

Note: existing endpoint examples in `06_API_SPEC.md` return top-level keys like `{ product }` or `{ cart }` directly for brevity; when implementing, wrap these consistently under `data` OR keep them top-level — choose one convention at the start of Phase 1 and apply it to every endpoint without exception. Consistency matters more than which convention is chosen.

## Logging Rules

- Use a single small logging helper (`lib/logger.ts`) with `logger.info/warn/error`, not raw `console.log`, in committed code.
- Log server-side errors with enough context (route, userId if available, error message) but never log passwords, tokens, or full request bodies containing sensitive data.
- No logging in Client Components beyond temporary local debugging, which must be removed before merge (see `25_DEVELOPER_CHECKLIST.md`).

## Comment Policy

- Comment **why**, not **what** — the code should already say what it does.
- Every non-obvious business rule enforced in a service function gets a one-line comment pointing to the relevant section of `09_BUSINESS_RULES.md`.
- No commented-out code left in commits.
- No TODO comments merged into the codebase without a corresponding tracked item in `27_PROJECT_ROADMAP.md`.

## Code Duplication Rules

- If the same logic appears in two places, extract it into `services/`, `lib/utils.ts`, or a shared component/hook before adding a third occurrence.
- Zod schemas are the single source of truth for a shape's validation rules — never re-implement the same checks manually in a component or service.
- Repeated UI patterns (e.g., a status badge, a stat card) must use the shared component from `08_COMPONENTS.md`, not a copy-pasted variant.
