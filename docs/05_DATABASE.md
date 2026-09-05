# 05 — Database Design (MongoDB Atlas / Mongoose)

## Collections Overview

- `users`
- `buyerprofiles`
- `supplierprofiles`
- `products`
- `carts`
- `orders`

## `users`

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | |
| `name` | String | required |
| `email` | String | required, unique, lowercase, indexed |
| `passwordHash` | String | required |
| `role` | String enum: `buyer`, `supplier` | required |
| `onboardingCompleted` | Boolean | default `false` |
| `createdAt` / `updatedAt` | Date | timestamps |

**Indexes**: `{ email: 1 }` unique.

## `buyerprofiles`

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | |
| `user` | ObjectId ref `users` | required, unique |
| `businessType` | String | e.g. Retailer, Manufacturer, Designer |
| `industry` | String | |
| `categoriesOfInterest` | [String] | |
| `preferredFabricTypes` | [String] | |
| `typicalOrderQuantity` | String / Number | free text or numeric range |
| `budgetRange` | String | e.g. "₹50k–₹2L" |
| `additionalPreferences` | String | free text |
| `createdAt` / `updatedAt` | Date | timestamps |

**Indexes**: `{ user: 1 }` unique.

## `supplierprofiles`

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | |
| `user` | ObjectId ref `users` | required, unique |
| `businessName` | String | required |
| `businessType` | String | e.g. Manufacturer, Wholesaler, Mill |
| `contactPhone` | String | |
| `contactEmail` | String | |
| `address` | String | |
| `operatingHours` | String | e.g. "Mon–Sat, 9am–6pm" |
| `productCategories` | [String] | |
| `fabricTypesOffered` | [String] | |
| `moq` | Number | minimum order quantity |
| `additionalInfo` | String | free text |
| `createdAt` / `updatedAt` | Date | timestamps |

**Indexes**: `{ user: 1 }` unique.

## `products`

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | |
| `supplier` | ObjectId ref `users` | required, indexed |
| `name` | String | required |
| `category` | String | required, indexed |
| `fabricType` | String | |
| `description` | String | required |
| `images` | [String] | Cloudinary URLs |
| `colors` | [String] | |
| `specifications` | Object (Map<String,String>) | e.g. `{ width: "58in", weight: "180gsm" }` |
| `stock` | Number | required, default 0 |
| `price` | Number | required, per unit |
| `moq` | Number | inherited default from supplier profile, overridable per product |
| `isAvailable` | Boolean | default `true`; false = "Out of Stock" |
| `isFeatured` | Boolean | default `false`, drives homepage Featured section |
| `createdAt` / `updatedAt` | Date | timestamps |

**Indexes**: `{ supplier: 1 }`, `{ category: 1 }`, text index on `{ name: "text", description: "text", category: "text" }` for search.

**Validation rules**:
- `price >= 0`, `stock >= 0`.
- `images` array max length enforced client-side (e.g. 5) to keep upload demo-friendly.
- `isAvailable` auto-set to `false` when `stock === 0` (enforced in `product.service.ts`, not the schema, to keep model logic simple).

## `carts`

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | |
| `buyer` | ObjectId ref `users` | required, unique (one active cart per buyer) |
| `items` | [CartItem] | see below |
| `updatedAt` | Date | timestamp |

**CartItem subdocument**:

| Field | Type | Notes |
|---|---|---|
| `product` | ObjectId ref `products` | required |
| `quantity` | Number | required, `>= 1` |
| `priceAtAdd` | Number | snapshot of price when added |

**Indexes**: `{ buyer: 1 }` unique.

**Validation rules**: `quantity` must not exceed the referenced product's current `stock` at the time of checkout (enforced in `cart.service.ts` / `order.service.ts`).

## `orders`

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | |
| `buyer` | ObjectId ref `users` | required, indexed |
| `items` | [OrderItem] | see below |
| `shippingInfo` | Object | `{ name, phone, addressLine1, addressLine2, city, state, postalCode }` |
| `totalAmount` | Number | computed at creation time |
| `status` | String enum | `Pending`, `Accepted`, `Preparing`, `Ready for Dispatch`, `Completed` — default `Pending` |
| `createdAt` / `updatedAt` | Date | timestamps |

**OrderItem subdocument**:

| Field | Type | Notes |
|---|---|---|
| `product` | ObjectId ref `products` | required |
| `supplier` | ObjectId ref `users` | denormalized for supplier order queries |
| `name` | String | denormalized snapshot |
| `price` | Number | snapshot at order time |
| `quantity` | Number | required |

**Indexes**: `{ buyer: 1 }`, `{ "items.supplier": 1 }`, `{ status: 1 }`.

**Validation rules**:
- `status` transitions enforced only in this order: `Pending → Accepted → Preparing → Ready for Dispatch → Completed`. No skipping, no reverse transitions, no cancellation status.
- An order may contain items from multiple suppliers; each supplier only sees/updates the sub-portion relevant to them in the UI, but for hackathon simplicity the `status` field is tracked at the whole-order level (see `09_BUSINESS_RULES.md` for the simplification note).

## Relationships Summary

- `users` 1:1 `buyerprofiles` (when `role = buyer`)
- `users` 1:1 `supplierprofiles` (when `role = supplier`)
- `users` (supplier) 1:N `products`
- `users` (buyer) 1:1 `carts`
- `users` (buyer) 1:N `orders`
- `products` N:M `orders` via `OrderItem`
