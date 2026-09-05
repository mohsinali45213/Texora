# 12 — Testing (Manual)

No automated CI/CD is in scope. Testing is manual, run before each demo and before final submission.

## Manual Testing Checklist

### Auth
- [ ] Register as Buyer succeeds and logs in automatically or redirects to login.
- [ ] Register as Supplier succeeds.
- [ ] Duplicate email registration is rejected with a clear error.
- [ ] Login with correct credentials succeeds; wrong password is rejected.
- [ ] Logout clears session and protected pages redirect to login afterward.
- [ ] A buyer cannot access supplier routes and vice versa (role guard).

### Onboarding
- [ ] New buyer is redirected to onboarding before reaching the marketplace.
- [ ] New supplier is redirected to onboarding before reaching the dashboard.
- [ ] Onboarding data persists and is visible/editable later in profile.
- [ ] Completing onboarding twice is not required on subsequent logins.

### Marketplace Discovery
- [ ] Landing page loads featured products and categories.
- [ ] Search returns relevant results for a known product name/keyword.
- [ ] Filters (category, fabric type, price range, availability) narrow results correctly, individually and combined.
- [ ] Product grid paginates correctly with more than one page of results.
- [ ] Empty search/filter state shows a friendly empty message, not a blank/broken page.

### Product Details
- [ ] All product fields render correctly (images, name, category, description, colors, specs, stock, price).
- [ ] Add to Cart respects available stock (cannot add more than in stock).
- [ ] Out-of-stock product disables Add to Cart / shows correct badge.

### AI Assistant
- [ ] Chat widget opens/closes and sends/receives messages referencing real products.
- [ ] Voice input transcribes speech to text and submits it through chat.
- [ ] Natural language search returns products matching the intent of a free-text query.
- [ ] Recommendations reflect the buyer's onboarding preferences.
- [ ] Comparison of 2–3 selected products returns a coherent summary and correct product data.
- [ ] Similar products on a product page are relevant (same/related category).
- [ ] Product Q&A answers correctly from the product's own data and declines gracefully when info isn't available.
- [ ] Traditional browsing/search/filter still work with AI features untouched (AI is additive, not a replacement).

### Cart
- [ ] Add, update quantity, and remove all work and reflect immediately in the UI.
- [ ] Cart total recalculates correctly on every change.
- [ ] Cart persists across page reloads (same buyer session).
- [ ] Attempting to set quantity above stock is blocked with a clear message.

### Checkout
- [ ] Shipping info form validates required fields.
- [ ] Order summary matches cart contents and total exactly.
- [ ] Placing an order succeeds, clears the cart, and shows a confirmation with an order reference.
- [ ] Product stock decreases by the ordered quantity after checkout.
- [ ] Checking out with insufficient stock (e.g., stock changed after adding to cart) is blocked with a clear error.

### Buyer Dashboard
- [ ] Profile displays correct onboarding data and is editable.
- [ ] Current orders and past orders lists are accurate and reflect real order data (not hardcoded).
- [ ] Clicking an order shows correct detail and current status.

### Supplier Dashboard
- [ ] Widget counts (total products, active products, pending orders) match actual data.
- [ ] Recent orders list shows the latest orders correctly.
- [ ] Inventory alerts correctly flag low/out-of-stock products.

### Inventory Management
- [ ] Add Product with images succeeds and appears in the buyer-facing marketplace.
- [ ] Edit Product updates fields correctly and reflects on the buyer side.
- [ ] Delete Product removes it from both supplier list and marketplace.
- [ ] Marking a product Out of Stock hides/disables Add to Cart on the buyer side.

### Order Management
- [ ] Incoming order appears for the correct supplier(s) only.
- [ ] Order detail shows correct shipping info and items.
- [ ] Status can only move forward one step at a time in the fixed sequence.
- [ ] Attempting an invalid status transition (e.g., skipping a step) is rejected.
- [ ] Buyer sees the updated status after the supplier changes it (on refresh/next load).

### Responsiveness
- [ ] All buyer pages usable at mobile width (~375px): navbar collapses, grids stack, forms are usable.
- [ ] All supplier pages usable at mobile width.
- [ ] Chat widget is usable on mobile without covering critical UI.

### Cross-Cutting
- [ ] No console errors on any core page.
- [ ] All forms show inline validation errors for invalid input.
- [ ] No out-of-scope feature (payment, admin panel, notifications, reviews, etc.) is present anywhere in the UI or API.

## Acceptance Criteria (Definition of Done for Submission)

1. Both full journeys (Buyer and Supplier) from `00_PROJECT_OVERVIEW.md` Success Criteria run end-to-end without errors on the deployed Vercel URL.
2. AI assistant features are demonstrably grounded in real database content, not hardcoded strings.
3. The application is usable on both desktop and mobile viewports.
4. No out-of-scope feature exists anywhere in the codebase or UI.
5. Demo video clearly walks through both roles and the AI features.
