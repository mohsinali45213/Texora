# 07 — UI Flow

## Global Navigation

- **Public/Buyer Navbar**: Logo, Search bar, Categories dropdown, Cart icon (badge count), Chat/AI icon, Login/Register or Profile menu (Dashboard, Logout).
- **Supplier Navbar**: Logo, Dashboard, Products, Orders, Profile, Logout.
- **Mobile**: both collapse into a hamburger `MobileMenu` with the same links.

## Buyer Journey

1. **Landing Page** (`/`)
   - Hero banner, Featured Products carousel/grid, Category tiles, entry point to AI chat.
   - CTA → Register/Login if unauthenticated, or straight into browsing.

2. **Register** (`/register`) → choose role (Buyer/Supplier) → `/onboarding` (role-specific).

3. **Buyer Onboarding** (`/onboarding`)
   - Conversational or stepped form: business type → industry → category interests → preferred fabrics → order quantity → budget range → optional notes.
   - On completion → redirect to Marketplace home.

4. **Marketplace / Product Listing** (`/products`)
   - Search bar (text + AI natural-language toggle), filter sidebar (category, fabric type, price range, availability), sort control, paginated `ProductGrid`.
   - Persistent `ChatWidget` (bottom-right) available on every buyer page.

5. **Category Page** (`/categories/[slug]`) — same grid, pre-filtered by category.

6. **Product Details** (`/products/[id]`)
   - Image gallery, name, category, description, colors, specifications table, stock, price, quantity selector, Add to Cart.
   - "Similar Products" AI section below the fold.
   - "Ask about this product" AI Q&A box.
   - Optional "Compare" action to add to a comparison tray (2–3 products).

7. **Comparison View** (modal or `/products/compare?ids=...`)
   - Side-by-side product attributes + AI-generated comparison summary.

8. **Cart** (`/cart`)
   - Line items with quantity steppers, remove action, order summary (subtotal, item count), "Proceed to Checkout" CTA.

9. **Checkout** (`/checkout`)
   - Step 1: Shipping Information form.
   - Step 2: Order Summary (items, quantities, prices, total).
   - Step 3: Review & Place Order.
   - On submit → `/checkout/confirmation` showing order number and status `Pending`.

10. **Buyer Dashboard** (`/dashboard`)
    - Profile summary card (edit link).
    - Current Orders list (status badges).
    - Past Orders list.
    - Click into `/dashboard/orders/[id]` for full order detail + status timeline.

## Supplier Journey

1. **Register** (`/register`, role=supplier) → `/onboarding` (supplier variant).

2. **Supplier Onboarding** (`/onboarding`)
   - Business name → type → contact info → address → operating hours → categories → fabric types offered → MOQ → additional info.
   - On completion → redirect to Supplier Dashboard.

3. **Supplier Dashboard** (`/dashboard`)
   - Widget cards: Total Products, Active Products, Pending Orders, Recent Orders list, Inventory Alerts (low/out-of-stock products).
   - Quick links: "Add Product", "View Orders".

4. **Product Inventory List** (`/products`)
   - Table/grid of own products: thumbnail, name, category, stock, price, availability toggle, Edit/Delete actions.
   - "Add New Product" CTA → `/products/new`.

5. **Add/Edit Product** (`/products/new`, `/products/[id]/edit`)
   - Form: name, category, fabric type, description, colors, specifications (key/value pairs), stock, price, MOQ, image upload (Cloudinary), availability toggle.
   - Save → back to inventory list with success toast.

6. **Order List** (`/orders`)
   - Table of incoming orders (containing the supplier's products): order id, buyer, items count, total, status, date.
   - Filter by status.

7. **Order Detail** (`/orders/[id]`)
   - Shipping info, item list with quantities/prices, current status, status update control restricted to the next valid status in the sequence.

8. **Supplier Profile** (`/profile`)
   - Editable business name, contact info, address, operating hours.

## AI Touchpoints (Buyer-Side, Cross-Cutting)

- **ChatWidget**: floating button on all buyer pages → slide-over panel with conversational chat, text input + voice input button, message history.
- **Natural Language Search**: toggle on the product listing search bar; free text is sent to `/api/ai/search` and results replace the grid.
- **Recommendations**: "Recommended for you" section on landing page and dashboard, powered by `/api/ai/recommend`.
- **Similar Products**: section on product detail page, powered by `/api/ai/similar`.
- **Comparison**: comparison tray / modal, powered by `/api/ai/compare`.
- **Product Q&A**: inline box on product detail page, powered by `/api/ai/qa`.

## Component Reuse Across Flows

- `ProductCard` / `ProductGrid` — landing, listing, category, similar products, recommendations.
- `OrderStatusBadge` / `OrderTimeline` — buyer dashboard, supplier orders, order detail.
- `ChatWidget` — global buyer layout only.
- `FormField`, `Select`, `TextArea`, `ImageUploader` — onboarding, product forms, profile forms.
