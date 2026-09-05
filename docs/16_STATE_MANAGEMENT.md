# 16 — State Management

Where state lives is decided by scope and lifetime, not convenience. Default to the narrowest option that works.

## Decision Order (Check in This Sequence)

1. Can this be a **Server Component** with no client state at all? → Use it. Most read-only pages (product listing, dashboards, order history) need no client state; fetch data server-side and pass it down as props.
2. Does the state only matter to **one component subtree** and not survive navigation? → **Local state** (`useState`/`useReducer`) inside a Client Component.
3. Does the state need to be shared across **many unrelated components** on the same page/layout, and change relatively rarely? → **React Context**, scoped as narrowly as possible.
4. Does the state need to survive across the whole buyer session (e.g., cart) or represent the authenticated user? → A **dedicated Context + hook** (`useCart`, `useAuth`), provided once near the root of the relevant layout, never duplicated.

Do not skip ahead to Context or global state "just in case." Every Context added must be justified by data actually needed in 3+ sibling/cousin components.

## Server Components

- Default for all pages under `app/` unless the page needs interactivity.
- Fetch data directly via `services/`/`repositories/` (server-only) or an internal `fetch` to the API — prefer direct service calls to avoid an unnecessary network hop within the same app.
- Pass fetched data down as props to Client Components that need to render/interact with it.
- Never fetch the same data twice (once server-side for render, again client-side in `useEffect`) — pick one source per page load.

## Client Components

- Marked with `"use client"`, used only for: forms, buttons with handlers, the cart, the AI chat widget, image uploader, filters that update the URL/query without a full page reload, voice input.
- Keep Client Components as low in the tree as possible — wrap only the interactive part, not the whole page, in `"use client"`.

## Local State

- `useState` for simple form fields, toggles, modal open/close, local loading flags.
- `useReducer` only when a component manages several related pieces of state that update together (e.g., a multi-step onboarding form) — otherwise `useState` is simpler and preferred.
- Local state never duplicates server data that a parent Server Component already fetched; pass it as a prop instead of re-fetching into local state.

## Context — Used For Exactly Two Things

1. **`AuthContext`** (via `useAuth`) — current user id/role/onboarding status, provided once in the root layout, read anywhere that needs to know "who is logged in."
2. **`CartContext`** (via `useCart`) — buyer's cart items and mutation functions (add/update/remove), provided once in the `(buyer)` layout, consumed by `Navbar` (badge count), `ProductCard`/product detail (Add to Cart), `cart` page, and `checkout` page.

No other global Context should exist. In particular:

- **Do not** create a Context for product listing/filter state — keep that in the URL (`searchParams`) so it's shareable and refresh-safe, read directly in the Server Component.
- **Do not** create a Context for AI chat state beyond the `ChatWidget` component's own local state — chat history for a single session does not need to be globally accessible outside the widget.
- **Do not** create a Context for supplier dashboard widgets — each dashboard page fetches its own data server-side.

## When NOT to Create Context

Avoid Context when:

- Only 1–2 components need the data (pass props instead).
- The data is naturally scoped to a single page (keep it local or in `searchParams`).
- The data is fetched fresh per page anyway (Server Component fetch is simpler and avoids a client-side loading flash).
- You're tempted to use Context purely to "avoid prop drilling" two levels deep — two levels of props is not a problem worth solving with Context.

## Server Actions

Server Actions are **not used** in this project. All mutations go through the documented REST endpoints in `06_API_SPEC.md`, called from Client Components via `fetch`. This keeps a single, consistent contract (the API spec) for both the web UI and any future consumer, and avoids mixing two different mutation patterns in a 2-day build. If a future iteration adopts Server Actions, this document and `03_ARCHITECTURE.md` must be updated first.

## Data Revalidation

- No real-time layer (per `03_ARCHITECTURE.md` — no WebSockets). After a mutation (add to cart, place order, update product, update order status), the client re-fetches the affected data (e.g., `router.refresh()` for Server Component data, or re-calling the relevant `use*` hook's fetch function).
- Do not build optimistic-update machinery beyond simple, obvious cases (e.g., incrementing the cart badge immediately) — correctness and simplicity outweigh perceived snappiness for this scope.

## Summary Table

| State | Where | Mechanism |
|---|---|---|
| Product listing/filters | URL | `searchParams`, read in Server Component |
| Product/order/dashboard data | Server | Server Component fetch via services |
| Form fields | Local | `useState` + `react-hook-form` |
| Multi-step onboarding/checkout progress | Local | `useReducer` or `useState` within the flow's page/layout |
| Auth session (current user) | Global | `AuthContext` / `useAuth` |
| Cart | Global (buyer layout) | `CartContext` / `useCart` |
| AI chat messages | Local to widget | `useState` inside `ChatWidget` (via `useChat` hook) |
