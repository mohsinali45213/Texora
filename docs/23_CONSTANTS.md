# 23 — Constants

Centralized constants. Nothing in this list should ever be hardcoded inline in a component, service, or route handler — import from these shared modules instead.

## Location

- `lib/constants/roles.ts`
- `lib/constants/orderStatus.ts`
- `lib/constants/catalog.ts` (categories, fabric types — if not fully DB-derived, see note below)
- `lib/constants/routes.ts`
- `lib/constants/api.ts`
- `lib/constants/limits.ts`

Group by concern rather than one giant `constants.ts`, consistent with the feature-first structure in `04_FOLDER_STRUCTURE.md`.

## Roles

```ts
export const ROLES = {
  BUYER: "buyer",
  SUPPLIER: "supplier",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
```

No `admin` role exists anywhere — see `02_SCOPE.md`.

## Order Status

```ts
export const ORDER_STATUS = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  PREPARING: "Preparing",
  READY_FOR_DISPATCH: "Ready for Dispatch",
  COMPLETED: "Completed",
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

// Strict forward-only sequence — see 09_BUSINESS_RULES.md
export const ORDER_STATUS_SEQUENCE: OrderStatus[] = [
  ORDER_STATUS.PENDING,
  ORDER_STATUS.ACCEPTED,
  ORDER_STATUS.PREPARING,
  ORDER_STATUS.READY_FOR_DISPATCH,
  ORDER_STATUS.COMPLETED,
];
```

`order.service.ts`'s status-transition check must import `ORDER_STATUS_SEQUENCE` rather than re-declaring the order inline, so there is exactly one place that defines "what comes next."

## Categories & Fabric Types

Product `category` and `fabricType` are free-text-but-constrained fields (per `05_DATABASE.md`). For UI dropdowns (product form, filters) and AI context-building, maintain a suggested list so the demo data and filters stay coherent:

```ts
export const SUGGESTED_CATEGORIES = [
  "Shirting",
  "Home Furnishing",
  "Sarees",
  "Ethnic Wear",
  "Denim",
  "Workwear",
  "Sportswear",
  "Lining",
  "Winterwear",
  "Handloom",
] as const;

export const SUGGESTED_FABRIC_TYPES = [
  "Cotton",
  "Linen",
  "Silk",
  "Blended Silk",
  "Denim",
  "Twill",
  "Polyester",
  "Blends",
  "Khadi",
  "Wool",
] as const;
```

**Note**: `GET /api/categories` (per `06_API_SPEC.md`) returns categories dynamically from actual product data in the database — this constant list is only a UI convenience (default dropdown options, seed data reference per `22_SEED_DATA.md`), not the authoritative source of truth once real products exist.

## Routes (Frontend Paths)

```ts
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  ONBOARDING: "/onboarding",
  PRODUCTS: "/products",
  PRODUCT_DETAIL: (id: string) => `/products/${id}`,
  CATEGORY: (slug: string) => `/categories/${slug}`,
  CART: "/cart",
  CHECKOUT: "/checkout",
  CHECKOUT_CONFIRMATION: "/checkout/confirmation",
  BUYER_DASHBOARD: "/dashboard",
  BUYER_ORDER_DETAIL: (id: string) => `/dashboard/orders/${id}`,
  SUPPLIER_DASHBOARD: "/dashboard", // within (supplier) route group
  SUPPLIER_PRODUCTS: "/products",   // within (supplier) route group
  SUPPLIER_PRODUCT_NEW: "/products/new",
  SUPPLIER_PRODUCT_EDIT: (id: string) => `/products/${id}/edit`,
  SUPPLIER_ORDERS: "/orders",
  SUPPLIER_ORDER_DETAIL: (id: string) => `/orders/${id}`,
  SUPPLIER_PROFILE: "/profile",
} as const;
```

Note: buyer and supplier route groups both use paths like `/dashboard` and `/products` but resolve within their respective `(buyer)`/`(supplier)` route groups per `04_FOLDER_STRUCTURE.md` — these are not URL collisions, just parallel namespaces under different layouts.

## API Paths

```ts
export const API = {
  AUTH: { REGISTER: "/api/auth/register", LOGIN: "/api/auth/login", LOGOUT: "/api/auth/logout" },
  ONBOARDING: { BUYER: "/api/onboarding/buyer", SUPPLIER: "/api/onboarding/supplier" },
  PRODUCTS: "/api/products",
  PRODUCT: (id: string) => `/api/products/${id}`,
  CATEGORIES: "/api/categories",
  CART: "/api/cart",
  ORDERS: "/api/orders",
  ORDER: (id: string) => `/api/orders/${id}`,
  BUYER: { PROFILE: "/api/buyer/profile", ORDERS: "/api/buyer/orders" },
  SUPPLIER: {
    DASHBOARD: "/api/supplier/dashboard",
    PRODUCTS: "/api/supplier/products",
    ORDERS: "/api/supplier/orders",
    ORDER_STATUS: (id: string) => `/api/supplier/orders/${id}/status`,
    PROFILE: "/api/supplier/profile",
  },
  UPLOADS: { IMAGE: "/api/uploads/image" },
  AI: {
    CHAT: "/api/ai/chat",
    SEARCH: "/api/ai/search",
    RECOMMEND: "/api/ai/recommend",
    COMPARE: "/api/ai/compare",
    SIMILAR: "/api/ai/similar",
    QA: "/api/ai/qa",
  },
} as const;
```

This mirrors `06_API_SPEC.md` exactly — if a route path changes, update both this file and that document in the same change (per `21_GIT_WORKFLOW.md`).

## Validation Limits

```ts
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MAX_LENGTH: 100,
  PRODUCT_NAME_MAX_LENGTH: 150,
  PRODUCT_DESCRIPTION_MAX_LENGTH: 2000,
  ADDRESS_MAX_LENGTH: 300,
  QUESTION_MAX_LENGTH: 500, // AI Q&A input
  CHAT_MESSAGE_MAX_LENGTH: 1000,
} as const;
```

## File Upload Limits

```ts
export const UPLOAD_LIMITS = {
  MAX_IMAGE_SIZE_MB: 5,
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"] as const,
  MAX_IMAGES_PER_PRODUCT: 5,
} as const;
```

Referenced by `17_SECURITY.md` (upload validation), `05_DATABASE.md` (`images` array), and `08_COMPONENTS.md` (`ImageUploader` `max` prop).

## Inventory Thresholds

```ts
export const INVENTORY = {
  LOW_STOCK_THRESHOLD: 5, // triggers Inventory Alerts widget, per 09_BUSINESS_RULES.md
} as const;
```

## Pagination Defaults

```ts
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 50,
} as const;
```

Used by `GET /api/products` and any other paginated list endpoint, per `20_PERFORMANCE.md`.

## AI Limits

```ts
export const AI = {
  MAX_COMPARISON_PRODUCTS: 3,
  MIN_COMPARISON_PRODUCTS: 2,
  MAX_CONTEXT_PRODUCTS: 20, // candidate set size passed into prompts, per 10_AI.md
  MAX_CHAT_HISTORY_TURNS: 10,
} as const;
```

## Rule

Any literal number, status string, role string, or path string appearing more than once in the codebase must be sourced from one of these constant modules. If a new constant is needed, add it here first, then use it — do not introduce a new inline literal and "constant-ize it later."
