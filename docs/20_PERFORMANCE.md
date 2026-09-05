# 20 — Performance (Hackathon-Focused)

Practical performance rules that keep the demo fast without adding infrastructure. No Redis, no CDN configuration beyond Vercel/Cloudinary defaults, no dedicated performance tooling — see `02_SCOPE.md`.

## Image Optimization

- All product images are served from **Cloudinary**, which handles resizing/format optimization at the URL level (e.g., request appropriately sized variants via Cloudinary transformation parameters rather than shipping full-resolution originals to every card).
- Use Next.js `<Image>` for all rendered images (product cards, gallery, avatars) to get automatic lazy-loading and responsive `srcset` behavior — never a raw `<img>` tag for content images.
- Cap product image uploads at a small max count and reasonable max file size (see `23_CONSTANTS.md`) so payloads stay light by construction.

## Lazy Loading

- Below-the-fold sections (e.g., "Similar Products" on the product detail page, secondary category rows on the landing page) load their data client-side after initial page render, or are deferred via Next.js `<Image>`'s built-in lazy loading for images.
- The `ChatWidget` panel content (message list, voice input) only mounts when the widget is opened, not on every page load.

## Pagination

- `GET /api/products` always paginates (`page`, `limit` query params, default `limit=20` — see `23_CONSTANTS.md`); never return the full product collection in one response.
- Order lists (buyer dashboard, supplier orders) paginate or at least cap to a reasonable recent window (e.g., latest 50) if the demo dataset grows.
- Infinite scroll is not required — simple page-number pagination (Prev/Next or numbered) is sufficient and simpler to implement correctly.

## Caching

- No Redis or external cache layer (out of scope). Rely on:
  - Next.js's built-in caching for Server Component `fetch` calls where data doesn't need to be real-time (e.g., category list can be cached briefly with `revalidate`).
  - Cloudinary's CDN caching for images (automatic).
- Do not cache buyer-specific data (cart, orders, dashboard) — these must always reflect current state.
- Category list (`GET /api/categories`) is a good candidate for a short `revalidate` window (e.g., 60s) since it changes infrequently.

## Server Components

- Default to Server Components for all read-heavy pages (see `16_STATE_MANAGEMENT.md`) — this avoids shipping unnecessary client JS and avoids a client-side fetch waterfall for initial page content.
- Only hydrate as Client Components the specific interactive pieces (cart controls, forms, chat, filters that need client-side URL updates).

## Memoization

- Use `useMemo`/`useCallback` only where a measurable re-render cost exists (e.g., expensive derived calculations over a large product list, or stable callbacks passed to many list items) — do not reflexively wrap every function/value, which adds complexity without benefit at this scale.
- Prefer moving expensive computation server-side (in the Server Component or service layer) over client-side memoization wherever possible.

## Avoid Unnecessary Rerenders

- Keep Context values (`AuthContext`, `CartContext`) stable — memoize the context value object so consumers don't re-render on every provider re-render unless the actual data changed.
- Split large Client Components so that frequently-changing state (e.g., a text input) doesn't force re-render of unrelated sibling content — lift state only as high as needed.

## Bundle Size

- Import only what's needed from libraries (e.g., specific `lucide-react` icons, not a barrel import of the whole set, if this becomes measurable).
- Keep the AI chat/voice logic in `ChatWidget`'s own client bundle, not pulled into the main layout bundle, so pages that don't render the widget aren't penalized (Next.js code-splits by default per route/component boundary — avoid working against this by importing heavy client-only code at the root layout).
- No unused dependencies — see `15_CODING_STANDARDS.md` "Never add dependencies without justification."

## Database Queries

- Use the indexes defined in `05_DATABASE.md` (`email` unique, `supplier`, `category`, text index on products, `buyer`/`items.supplier`/`status` on orders) — every list/filter query should be able to use one of these indexes.
- Avoid N+1 queries: when listing orders with product/supplier details, use Mongoose `.populate()` deliberately and only for the fields actually rendered, not the full referenced document.
- Dashboard aggregate stats (`GET /api/supplier/dashboard`) use a single aggregation query (`countDocuments`/`aggregate`) per metric rather than fetching all documents into memory and counting client-side.
- Always project only needed fields for list views (e.g., product grid doesn't need the full `specifications` map) to reduce payload size.

## What's Explicitly Not Done

No server-side rendering performance budget tooling, no Lighthouse CI gate, no image CDN beyond Cloudinary defaults, no service worker/offline support, no code-splitting beyond what Next.js does automatically. These are appropriately out of scope for a 2-day hackathon MVP.
