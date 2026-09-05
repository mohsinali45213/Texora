# 06 — API Specification

All endpoints are Next.js Route Handlers under `app/api/`, Node.js runtime, JSON in/out. Authenticated endpoints require a valid session cookie (Auth.js) or `Authorization: Bearer <jwt>` depending on final auth choice (see `03_ARCHITECTURE.md`). Errors follow a consistent shape:

```json
{ "error": { "message": "string", "fields": { "field": "reason" } } }
```

> See `18_ERROR_HANDLING.md` for the full repository-wide error-handling policy (HTTP code mapping, per-layer handling, AI/Cloudinary fallbacks) and `15_CODING_STANDARDS.md` for the standardized success response wrapper. Route paths below should stay in sync with `23_CONSTANTS.md`'s `API` constant object.

---

## Auth

### `POST /api/auth/register`
- **Auth**: none
- **Body**: `{ name, email, password, role: "buyer" | "supplier" }`
- **Validation**: `auth.schema.ts` — email format, password min 8 chars, role enum
- **Response 201**: `{ user: { id, name, email, role, onboardingCompleted } }`
- **Errors**: 400 validation, 409 email already exists

### `POST /api/auth/login`
- **Auth**: none
- **Body**: `{ email, password }`
- **Response 200**: `{ user: {...} }` + sets session cookie
- **Errors**: 400 validation, 401 invalid credentials

### `POST /api/auth/logout`
- **Auth**: session required
- **Response 200**: `{ success: true }`, clears session cookie

---

## Onboarding

### `POST /api/onboarding/buyer`
- **Auth**: session, role=buyer
- **Body**: `{ businessType, industry, categoriesOfInterest[], preferredFabricTypes[], typicalOrderQuantity, budgetRange, additionalPreferences? }`
- **Validation**: `onboarding.schema.ts` (buyer variant)
- **Response 200**: `{ buyerProfile }`, sets `user.onboardingCompleted = true`
- **Errors**: 400 validation, 401 unauthenticated, 403 wrong role

### `POST /api/onboarding/supplier`
- **Auth**: session, role=supplier
- **Body**: `{ businessName, businessType, contactPhone, contactEmail, address, operatingHours, productCategories[], fabricTypesOffered[], moq, additionalInfo? }`
- **Response 200**: `{ supplierProfile }`, sets `user.onboardingCompleted = true`
- **Errors**: 400, 401, 403

---

## Products (Public Browse + Supplier Manage)

### `GET /api/products`
- **Auth**: none (public browsing)
- **Query**: `q?, category?, fabricType?, minPrice?, maxPrice?, available?, page?, limit?`
- **Response 200**: `{ items: Product[], total, page, limit }`

### `GET /api/products/:id`
- **Auth**: none
- **Response 200**: `{ product }`
- **Errors**: 404 not found

### `POST /api/products`
- **Auth**: session, role=supplier
- **Body**: `{ name, category, fabricType, description, images[], colors[], specifications, stock, price, moq? }`
- **Validation**: `product.schema.ts`
- **Response 201**: `{ product }`
- **Errors**: 400, 401, 403

### `PATCH /api/products/:id`
- **Auth**: session, role=supplier, must own product
- **Body**: partial product fields (including `stock`, `isAvailable`)
- **Response 200**: `{ product }`
- **Errors**: 400, 401, 403 (not owner), 404

### `DELETE /api/products/:id`
- **Auth**: session, role=supplier, must own product
- **Response 200**: `{ success: true }`
- **Errors**: 401, 403, 404

### `GET /api/categories`
- **Auth**: none
- **Response 200**: `{ categories: string[] }` (distinct values from `products.category`)

---

## Cart

### `GET /api/cart`
- **Auth**: session, role=buyer
- **Response 200**: `{ cart: { items: [...], total } }`

### `POST /api/cart`
- **Auth**: session, role=buyer
- **Body**: `{ productId, quantity }`
- **Validation**: `cart.schema.ts`; quantity `<= product.stock`
- **Response 200**: `{ cart }`
- **Errors**: 400 (invalid qty / exceeds stock), 401, 404 product not found

### `PATCH /api/cart`
- **Auth**: session, role=buyer
- **Body**: `{ productId, quantity }` (0 removes item)
- **Response 200**: `{ cart }`

### `DELETE /api/cart`
- **Auth**: session, role=buyer
- **Body**: `{ productId }`
- **Response 200**: `{ cart }`

---

## Orders

### `POST /api/orders`
- **Auth**: session, role=buyer
- **Body**: `{ shippingInfo: {...} }` (items pulled from buyer's current cart server-side)
- **Validation**: `order.schema.ts` for shippingInfo; stock re-validated per item
- **Response 201**: `{ order }`, clears buyer's cart, decrements product stock
- **Errors**: 400 (stock insufficient / empty cart / validation), 401

### `GET /api/orders/:id`
- **Auth**: session; buyer who owns it OR supplier with an item in it
- **Response 200**: `{ order }`
- **Errors**: 401, 403, 404

### `GET /api/buyer/orders`
- **Auth**: session, role=buyer
- **Query**: `status?`
- **Response 200**: `{ orders: Order[] }`

### `GET /api/buyer/profile`
- **Auth**: session, role=buyer
- **Response 200**: `{ user, buyerProfile }`

### `PATCH /api/buyer/profile`
- **Auth**: session, role=buyer
- **Body**: partial buyer profile fields
- **Response 200**: `{ buyerProfile }`

---

## Supplier

### `GET /api/supplier/dashboard`
- **Auth**: session, role=supplier
- **Response 200**: `{ totalProducts, activeProducts, pendingOrders, recentOrders: Order[], inventoryAlerts: Product[] }` (low-stock threshold defined in `product.service.ts`)

### `GET /api/supplier/products`
- **Auth**: session, role=supplier
- **Response 200**: `{ items: Product[] }` (own products only)

### `GET /api/supplier/orders`
- **Auth**: session, role=supplier
- **Query**: `status?`
- **Response 200**: `{ orders: Order[] }` (orders containing at least one of this supplier's items)

### `PATCH /api/supplier/orders/:id/status`
- **Auth**: session, role=supplier, must have an item in the order
- **Body**: `{ status: "Accepted" | "Preparing" | "Ready for Dispatch" | "Completed" }`
- **Validation**: transition must follow the fixed sequence in `09_BUSINESS_RULES.md`
- **Response 200**: `{ order }`
- **Errors**: 400 (invalid transition), 401, 403, 404

### `GET /api/supplier/profile`
- **Auth**: session, role=supplier
- **Response 200**: `{ user, supplierProfile }`

### `PATCH /api/supplier/profile`
- **Auth**: session, role=supplier
- **Body**: partial supplier profile fields
- **Response 200**: `{ supplierProfile }`

---

## Uploads

### `POST /api/uploads/image`
- **Auth**: session, role=supplier
- **Body**: multipart form-data (image file) or `{ fileBase64 }`
- **Response 200**: `{ url, publicId }` (Cloudinary secure URL)
- **Errors**: 400 (invalid file type/size), 401, 403

---

## AI

### `POST /api/ai/chat`
- **Auth**: session (buyer)
- **Body**: `{ message, conversationHistory?: [{role, content}] }`
- **Response 200**: `{ reply, referencedProducts?: Product[] }`

### `POST /api/ai/search`
- **Auth**: none or session
- **Body**: `{ query }`
- **Response 200**: `{ items: Product[], interpretedFilters }`

### `POST /api/ai/recommend`
- **Auth**: session, role=buyer
- **Body**: `{}` (uses buyer profile + recent activity server-side)
- **Response 200**: `{ items: Product[] }`

### `POST /api/ai/compare`
- **Auth**: none or session
- **Body**: `{ productIds: string[] }` (2–3 ids)
- **Response 200**: `{ comparison: string, products: Product[] }`

### `GET /api/ai/similar?productId=`
- **Auth**: none
- **Response 200**: `{ items: Product[] }`

### `POST /api/ai/qa`
- **Auth**: none or session
- **Body**: `{ productId, question }`
- **Response 200**: `{ answer }`

---

## Standard Error Codes

| Code | Meaning |
|---|---|
| 400 | Validation failure |
| 401 | Not authenticated |
| 403 | Authenticated but wrong role / not resource owner |
| 404 | Resource not found |
| 409 | Conflict (e.g., duplicate email) |
| 500 | Unexpected server error |
