# 09 — Business Rules

## Authentication

- A user has exactly one role: `buyer` or `supplier`, set at registration and immutable afterward.
- Passwords are hashed (bcrypt) before storage; never stored or logged in plaintext.
- A session/JWT identifies `userId` and `role`; every protected route re-checks role server-side, never trusting client-provided role claims.
- `onboardingCompleted` gates access to the main app: if `false`, the user is redirected to `/onboarding` regardless of which protected page they requested.

## Role Permissions

| Action | Buyer | Supplier |
|---|---|---|
| Browse/search/filter products | ✅ | ✅ (read-only, own products managed separately) |
| Add to cart / checkout | ✅ | ❌ |
| Create/edit/delete product | ❌ | ✅ (own products only) |
| Update order status | ❌ | ✅ (only orders containing their own product) |
| View buyer dashboard | ✅ (own data) | ❌ |
| View supplier dashboard | ❌ | ✅ (own data) |
| Use AI assistant | ✅ | ❌ (AI scope is buyer-facing per hackathon brief) |

A supplier may never edit or delete a product they do not own. A buyer may never view another buyer's cart, orders, or profile. Enforced in `services/`, verified again at the repository query level by scoping queries with the authenticated `userId`.

## Products

- `price >= 0` and `stock >= 0` at all times; validated server-side regardless of client input.
- `isAvailable` is automatically set to `false` when `stock` reaches `0`, and automatically re-enabled to `true` when stock is topped up above `0` unless the supplier explicitly marked it unavailable (supplier's manual override takes precedence — track via a separate `manuallyMarkedUnavailable` flag if needed, or keep it simple: any stock update recalculates availability from stock alone for the hackathon).
- A product must belong to exactly one `category` and reference the owning supplier's `user` id.
- Image uploads are limited to a small max count (e.g., 5) and standard image MIME types, enforced client-side and re-checked server-side before persisting the Cloudinary URL.

## Inventory

- Only the owning supplier can update stock, availability, or delete a product.
- "Inventory Alerts" on the supplier dashboard surface products where `stock <= lowStockThreshold` (sourced from `INVENTORY.LOW_STOCK_THRESHOLD` in `23_CONSTANTS.md`, currently `5`), including zero-stock ("Out of Stock") items.

## Shopping Cart

- One active cart per buyer (`carts.buyer` unique).
- Adding a product with `quantity` greater than current `product.stock` is rejected with a 400 error; the UI should also clamp the quantity selector to available stock.
- Cart item `priceAtAdd` is a snapshot; it does not update automatically if a supplier changes the price after the item was added, so the buyer sees a consistent price through checkout. Checkout re-validates current stock (not price) before finalizing.
- Cart is cleared automatically after a successful order is placed.

## Checkout & Orders

- Checkout requires: complete shipping info, non-empty cart, and sufficient stock for every line item (re-checked at order creation, not just at add-to-cart time, to handle race conditions).
- On order creation: stock is decremented per item, `totalAmount` is computed server-side from current cart snapshot (never trusted from client), and the order is created with `status = "Pending"`.
- **Simplification for hackathon scope**: an order may contain products from multiple suppliers, but the `status` field lives at the whole-order level rather than being tracked per-supplier-sub-order. Any supplier with an item in the order can view the order and advance its status; this is an accepted simplification, not a bug, and must not be "fixed" by introducing per-supplier sub-orders, which would add unnecessary complexity for a 2-day build.
- No payment step exists. "Place Order" is the final action; there is no payment status field anywhere in the schema.

## Order Status

- Allowed values, in strict forward-only sequence:
  `Pending → Accepted → Preparing → Ready for Dispatch → Completed`
- A status update request must specify exactly the next status in the sequence from the order's current status. Any other target status (including going backward, skipping a step, or a made-up status like "Cancelled") is rejected with a 400 error.
- Only a supplier with at least one item in the order may update its status. Buyers can view but never set status.

## Onboarding

- Onboarding is mandatory before accessing the marketplace (buyer) or dashboard (supplier); it is a one-time flow gated by `user.onboardingCompleted`.
- Fields collected are exactly those listed in the hackathon brief per role (see `01_REQUIREMENTS.md`); no additional fields should be invented.

## Validation (General)

- Every API route validates its request body/query against the corresponding Zod schema in `validations/` before touching the service layer; invalid input always returns 400 with per-field error messages, never a silent fallback.
- Client-side forms use the same Zod schemas (via `react-hook-form` resolver) so validation logic is written once and shared.

## AI Assistant

- The AI must ground its answers in actual marketplace data fetched from the database (`ai/context-builder.ts`), not invent product names, prices, or stock levels.
- AI responses are advisory only — they never directly mutate cart, orders, or inventory. Any action the AI "suggests" (e.g., "add this to your cart") must be confirmed via a normal UI action, not executed autonomously.
- AI features are buyer-facing only, per scope.
