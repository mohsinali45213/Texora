# 08 — Reusable Components

Presentational and lightly-interactive components live in `components/`. They receive data via props/hooks and must not contain business logic or direct database access. Feature-specific composition lives in `features/`.

## Layout

### `Navbar`
- **Responsibility**: top navigation, adapts by role (buyer/supplier/guest).
- **Props**: `role: "buyer" | "supplier" | "guest"`, `cartCount?: number`, `user?: { name }`.

### `MobileMenu`
- **Responsibility**: collapsible nav for small viewports.
- **Props**: `links: { label, href }[]`, `open: boolean`, `onClose: () => void`.

### `Footer`
- **Responsibility**: static footer links.
- **Props**: none.

## Product

### `ProductCard`
- **Responsibility**: compact product preview (image, name, price, availability badge).
- **Props**: `product: Product`, `onAddToCart?: (id: string) => void`, `variant?: "default" | "compact"`.

### `ProductGrid`
- **Responsibility**: responsive grid layout + empty/loading states.
- **Props**: `products: Product[]`, `isLoading?: boolean`.

### `ProductFilters`
- **Responsibility**: sidebar/drawer filter controls (category, fabric type, price range, availability).
- **Props**: `filters: FilterState`, `onChange: (filters: FilterState) => void`, `categories: string[]`.

### `ProductGallery`
- **Responsibility**: image carousel/gallery on product detail page.
- **Props**: `images: string[]`.

### `SpecificationsTable`
- **Responsibility**: key/value display of product specs.
- **Props**: `specifications: Record<string, string>`.

## Cart

### `CartItemRow`
- **Responsibility**: single cart line with quantity stepper and remove button.
- **Props**: `item: CartItem`, `onQuantityChange: (productId, qty) => void`, `onRemove: (productId) => void`.

### `CartSummary`
- **Responsibility**: subtotal, item count, checkout CTA.
- **Props**: `items: CartItem[]`, `onCheckout: () => void`.

## Orders

### `OrderStatusBadge`
- **Responsibility**: colored badge for one of the five allowed statuses.
- **Props**: `status: OrderStatus`.

### `OrderTimeline`
- **Responsibility**: visual progression through the five statuses.
- **Props**: `currentStatus: OrderStatus`.

### `OrderTable`
- **Responsibility**: tabular list of orders (used by both buyer and supplier views with different column configs).
- **Props**: `orders: Order[]`, `columns: ColumnConfig[]`, `onRowClick: (id) => void`.

## AI

### `ChatWidget`
- **Responsibility**: floating chat launcher + panel; manages message list, sends to `/api/ai/chat`.
- **Props**: none (self-contained, uses `useChat` hook).

### `VoiceInputButton`
- **Responsibility**: mic button triggering browser speech-to-text; emits transcribed text.
- **Props**: `onTranscript: (text: string) => void`.

### `ComparisonPanel`
- **Responsibility**: side-by-side product attribute comparison + AI summary text.
- **Props**: `products: Product[]`, `summary: string`.

### `ProductQnA`
- **Responsibility**: inline question input + answer display on product detail page.
- **Props**: `productId: string`.

### `SimilarProducts`
- **Responsibility**: horizontal list of AI-suggested similar products.
- **Props**: `productId: string`.

## Forms

### `FormField`
- **Responsibility**: label + input/textarea/select + error message wrapper, integrates with `react-hook-form`.
- **Props**: `name: string`, `label: string`, `type?`, `options?` (for select), `error?: string`.

### `ImageUploader`
- **Responsibility**: drag/drop or click-to-upload, calls `/api/uploads/image`, shows preview thumbnails.
- **Props**: `value: string[]`, `onChange: (urls: string[]) => void`, `max?: number`.

### `StepIndicator`
- **Responsibility**: shows progress through multi-step forms (onboarding, checkout).
- **Props**: `steps: string[]`, `currentStep: number`.

## Dashboard Widgets

### `StatCard`
- **Responsibility**: single metric display (e.g., "Total Products: 24").
- **Props**: `label: string`, `value: string | number`, `icon?: ReactNode`.

### `InventoryAlertList`
- **Responsibility**: list of low/out-of-stock products.
- **Props**: `products: Product[]`.

## Composition Rule

Any component that needs data must receive it via props from a Server Component page or a hook in `hooks/`/`features/*/hooks`. Components in `components/` never call `fetch` directly except small, self-contained widgets explicitly noted above (`ChatWidget`, `ImageUploader`) where the round-trip is the component's sole purpose.
