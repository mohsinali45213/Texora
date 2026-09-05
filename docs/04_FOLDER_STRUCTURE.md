# 04 — Folder Structure

Feature-first structure inside a single Next.js repository.

```
/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── layout.tsx
│   │
│   ├── (buyer)/
│   │   ├── layout.tsx                 # buyer nav shell
│   │   ├── page.tsx                   # marketplace landing/home
│   │   ├── onboarding/page.tsx
│   │   ├── products/
│   │   │   ├── page.tsx               # listing + search + filters
│   │   │   └── [id]/page.tsx          # product details
│   │   ├── categories/[slug]/page.tsx
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   ├── checkout/confirmation/page.tsx
│   │   └── dashboard/
│   │       ├── page.tsx               # profile + order overview
│   │       └── orders/[id]/page.tsx
│   │
│   ├── (supplier)/
│   │   ├── layout.tsx                 # supplier nav shell
│   │   ├── onboarding/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── products/
│   │   │   ├── page.tsx               # inventory list
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/edit/page.tsx
│   │   ├── orders/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   └── profile/page.tsx
│   │
│   ├── api/
│   │   ├── auth/
│   │   │   ├── register/route.ts
│   │   │   ├── login/route.ts
│   │   │   └── logout/route.ts
│   │   ├── onboarding/
│   │   │   ├── buyer/route.ts
│   │   │   └── supplier/route.ts
│   │   ├── products/
│   │   │   ├── route.ts               # GET list, POST create (supplier)
│   │   │   └── [id]/route.ts          # GET, PATCH, DELETE
│   │   ├── categories/route.ts
│   │   ├── cart/route.ts
│   │   ├── orders/
│   │   │   ├── route.ts               # POST create order (buyer)
│   │   │   └── [id]/route.ts          # GET single order
│   │   ├── buyer/
│   │   │   ├── profile/route.ts
│   │   │   └── orders/route.ts
│   │   ├── supplier/
│   │   │   ├── profile/route.ts
│   │   │   ├── dashboard/route.ts
│   │   │   ├── products/route.ts
│   │   │   ├── orders/route.ts
│   │   │   └── orders/[id]/status/route.ts
│   │   ├── uploads/image/route.ts     # Cloudinary signed upload
│   │   └── ai/
│   │       ├── chat/route.ts
│   │       ├── search/route.ts
│   │       ├── recommend/route.ts
│   │       ├── compare/route.ts
│   │       ├── similar/route.ts
│   │       └── qa/route.ts
│   │
│   ├── layout.tsx                     # root layout
│   └── globals.css
│
├── components/
│   ├── ui/                            # shadcn/ui primitives (button, input, card, dialog...)
│   ├── layout/                        # Navbar, Footer, MobileMenu
│   ├── product/                       # ProductCard, ProductGrid, ProductFilters
│   ├── cart/                          # CartItem, CartSummary
│   ├── orders/                        # OrderStatusBadge, OrderTimeline
│   ├── ai/                            # ChatWidget, VoiceInputButton, ComparisonPanel
│   └── forms/                         # shared form building blocks
│
├── features/
│   ├── auth/
│   ├── buyer-onboarding/
│   ├── supplier-onboarding/
│   ├── marketplace/
│   ├── cart/
│   ├── checkout/
│   ├── buyer-dashboard/
│   ├── supplier-dashboard/
│   ├── inventory/
│   ├── orders/
│   └── ai-assistant/
│   # Each feature folder may contain: components/, hooks/, and feature-local types.
│   # Business logic itself lives in services/, not here.
│
├── lib/
│   ├── db.ts                          # Mongoose connection singleton
│   ├── auth.ts                        # session helpers, requireAuth()
│   ├── cloudinary.ts                  # Cloudinary client config
│   ├── huggingface.ts                 # HF Inference API client
│   └── utils.ts
│
├── services/
│   ├── auth.service.ts
│   ├── onboarding.service.ts
│   ├── product.service.ts
│   ├── cart.service.ts
│   ├── order.service.ts
│   └── ai.service.ts
│
├── repositories/
│   ├── user.repository.ts
│   ├── product.repository.ts
│   ├── cart.repository.ts
│   └── order.repository.ts
│
├── models/
│   ├── User.ts
│   ├── BuyerProfile.ts
│   ├── SupplierProfile.ts
│   ├── Product.ts
│   ├── Cart.ts
│   └── Order.ts
│
├── validations/
│   ├── auth.schema.ts
│   ├── onboarding.schema.ts
│   ├── product.schema.ts
│   ├── cart.schema.ts
│   └── order.schema.ts
│
├── ai/
│   ├── prompts/
│   │   ├── chat.prompt.ts
│   │   ├── search.prompt.ts
│   │   ├── recommend.prompt.ts
│   │   ├── compare.prompt.ts
│   │   └── qa.prompt.ts
│   └── context-builder.ts             # fetches relevant product data for prompts
│
├── hooks/
│   ├── useCart.ts
│   ├── useAuth.ts
│   └── useChat.ts
│
├── types/
│   ├── user.ts
│   ├── product.ts
│   ├── cart.ts
│   └── order.ts
│
├── docs/                              # this documentation suite
│
├── scripts/
│   └── seed.ts                        # demo data loader, see 22_SEED_DATA.md
│
├── middleware.ts
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── .env.example
```

## Directory Responsibilities

- **app/** — routing only: pages compose components and call `services`/`hooks`; API routes are thin controllers.
- **components/** — pure, reusable presentational UI. No direct DB or fetch calls beyond passed-in data/handlers.
- **features/** — feature-scoped client-side composition (hooks + components specific to one feature), not business logic.
- **lib/** — cross-cutting infrastructure clients and helpers (DB connection, auth, Cloudinary, Hugging Face).
- **services/** — all business logic. This is the only layer allowed to enforce rules like MOQ checks, stock validation, order status transitions.
- **repositories/** — the only layer allowed to import Mongoose models and run queries.
- **models/** — Mongoose schema definitions only.
- **validations/** — Zod schemas shared by client forms and API route handlers.
- **ai/** — prompt templates and context-building logic for Hugging Face calls; called only from `services/ai.service.ts`.
- **types/** — shared TypeScript types/interfaces.
