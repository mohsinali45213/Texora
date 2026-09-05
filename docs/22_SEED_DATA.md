# 22 — Seed Data

The application must never look empty during review or demo. This document defines a realistic demo dataset and how it's loaded, per `11_DEVELOPMENT_PLAN.md` Phase 8.

## Seed Script Location

`scripts/seed.ts` — a standalone Node script (not part of any production route or `app/api/`) that connects to `MONGODB_URI` and inserts the dataset below. Run manually and locally against the target (usually the same Atlas cluster used by the deployed app) before recording the demo:

```bash
npx tsx scripts/seed.ts
```

The script must be **idempotent-safe enough for a hackathon**: either clear the relevant collections first or check for existing seed markers before inserting, so re-running it doesn't create duplicate demo data.

## Suppliers (5)

Create 5 supplier accounts, each with completed onboarding, spanning different fabric specialties so the marketplace feels varied:

| # | Business Name | Fabric Focus | Categories |
|---|---|---|---|
| 1 | Ganga Textile Mills | Cotton, Linen | Shirting, Home Furnishing |
| 2 | Suryaa Silk House | Silk, Blended Silk | Sarees, Ethnic Wear |
| 3 | Vardhman Weaves | Denim, Twill | Denim, Workwear |
| 4 | Aura Synthetics | Polyester, Blends | Sportswear, Lining |
| 5 | Heritage Handlooms | Khadi, Wool | Winterwear, Handloom |

Each supplier account: valid `email`/`password`, completed `supplierProfile` (business name, type, contact, address, operating hours, categories, fabric types, MOQ — realistic values, not placeholders like "test123").

## Products (50)

10 products per supplier, distributed across their fabric focus and categories above. Each product includes:

- Realistic `name` (e.g., "Premium Cotton Poplin — White", not "Product 1").
- `category` and `fabricType` matching the supplier's focus.
- 2–4 `images` (Cloudinary URLs from an initial upload pass, or stock textile photography uploaded once and reused across seed products).
- 2–5 `colors`.
- `specifications` (e.g., `{ width: "58in", weight: "180 GSM", weave: "Plain" }`).
- `stock`: varied values — include a mix so `23_CONSTANTS.md`'s low-stock threshold and out-of-stock states are all visible in the demo (e.g., a few products with `stock: 0`, a few with `stock: 3` to trigger inventory alerts, most with healthy stock like `50`–`500`).
- `price`: realistic per-unit/per-meter pricing.
- `isFeatured: true` on ~6–8 products across suppliers so the landing page's Featured section looks curated, not random.

## Buyer Accounts

Create at least 2 buyer accounts with completed onboarding, representing different buyer profiles:

| # | Business Type | Preferences |
|---|---|---|
| 1 | Retailer | Cotton, mid budget range, moderate order quantity |
| 2 | Fashion Designer | Silk & blends, higher budget range, small order quantity |

These support demoing AI recommendations that visibly differ per buyer profile.

## Categories & Fabric Types

Derived from the products above, not hardcoded separately — but for reference, seed data should span at least:

- **Categories**: Shirting, Home Furnishing, Sarees, Ethnic Wear, Denim, Workwear, Sportswear, Lining, Winterwear, Handloom.
- **Fabric Types**: Cotton, Linen, Silk, Blended Silk, Denim, Twill, Polyester, Blends, Khadi, Wool.

## Orders

Seed a small set of orders so both dashboards look active on first load, covering every allowed status at least once:

| # | Buyer | Supplier(s) | Status |
|---|---|---|---|
| 1 | Buyer 1 | Ganga Textile Mills | Completed |
| 2 | Buyer 1 | Vardhman Weaves | Ready for Dispatch |
| 3 | Buyer 2 | Suryaa Silk House | Preparing |
| 4 | Buyer 2 | Aura Synthetics | Accepted |
| 5 | Buyer 1 | Heritage Handlooms | Pending |

Each order includes realistic `shippingInfo` and 1–3 line items with correct `priceAtAdd`/`totalAmount` snapshots consistent with the seeded product prices at insert time.

## Inventory Alerts

At least 2–3 seeded products per supplier's typical range should sit at or below the low-stock threshold defined in `23_CONSTANTS.md` (default `5`), and at least 1 product overall should have `stock: 0` / `isAvailable: false`, so the Supplier Dashboard's "Inventory Alerts" widget is populated on first load rather than empty.

## Demo Scenarios (Use During Recording)

1. **Buyer discovery**: log in as Buyer 1 → browse Featured Products → filter by "Cotton" → open a product → view Similar Products and ask the AI Q&A a question.
2. **AI recommendation**: on Buyer 2's dashboard/landing, show recommendations skewing toward silk products, reflecting their onboarding profile.
3. **Cart & checkout**: add 2 products from different suppliers to cart → checkout → confirm order appears as `Pending` in Buyer 1's dashboard.
4. **Supplier fulfillment**: log in as the relevant supplier → see the new order in Order Management → advance status step by step → confirm the buyer's dashboard reflects the update.
5. **Inventory management**: log in as a supplier with a low-stock product → show the Inventory Alerts widget → edit the product to top up stock → confirm the alert clears and the product's availability updates on the buyer side.

## Rule

Seed data must use realistic values throughout — no "Lorem ipsum," no "Test Product 1," no placeholder emails like `test@test.com` for demo accounts (use clearly-labeled but realistic-looking values, e.g., `buyer1.demo@marketplace.test`). The goal is that a reviewer scrolling the app never encounters an obviously fake or empty screen.
