# 01 — Requirements

Every hackathon requirement mapped to an actionable engineering task. Nothing is added beyond what the hackathon brief and the scope-lock prompt specify.

## Buyer Requirements

| # | Requirement | Engineering Task |
|---|---|---|
| B1 | Register | `POST /api/auth/register` (role=buyer) + registration form |
| B2 | Login | `POST /api/auth/login`, issue JWT/session cookie |
| B3 | Logout | `POST /api/auth/logout`, clear session |
| B4 | Buyer Onboarding | Conversational/form onboarding flow capturing business type, industry, category interests, preferred fabrics, typical order quantity, budget range; stored on Buyer profile |
| B5 | Landing Page | Marketing/home page with hero, featured products, categories |
| B6 | Responsive Navigation | Shared `Navbar` component, mobile hamburger menu |
| B7 | Featured Products | Home page section pulling flagged/top products |
| B8 | Product Categories | Category list/grid, category filter page |
| B9 | Product Search | Text search across product name/description/category |
| B10 | Product Filtering | Filter by category, fabric type, price range, availability |
| B11 | Product Listing/Grid | Paginated grid with `ProductCard` |
| B12 | Product Details Page | Images, name, category, description, colors, specs, stock, price, Add to Cart |
| B13 | AI Conversational Chat | Chat widget available across buyer journey |
| B14 | AI Voice Assistance | Speech-to-text input into the same chat pipeline |
| B15 | AI Natural Language Search | Free-text query → structured product filter + results |
| B16 | AI Fabric Recommendations | Suggested products based on onboarding profile + browsing |
| B17 | AI Product Comparison | Compare 2–3 products side-by-side via AI summary |
| B18 | AI Similar Product Suggestions | "Similar products" on product detail page |
| B19 | AI Product Q&A | Ask questions about a specific product, answered from product data |
| B20 | Shopping Cart | Add/update quantity/remove, persisted per buyer |
| B21 | Checkout (No Payment) | Shipping info → order summary → review → place order → confirmation |
| B22 | Buyer Dashboard | Profile, past orders, current orders, order status |
| B23 | Buyer Profile | View/edit basic profile fields |

## Supplier Requirements

| # | Requirement | Engineering Task |
|---|---|---|
| S1 | Register | `POST /api/auth/register` (role=supplier) |
| S2 | Login | `POST /api/auth/login` |
| S3 | Logout | `POST /api/auth/logout` |
| S4 | Supplier Onboarding | Business name, type, contact, address, operating hours, categories, fabric types, MOQ |
| S5 | Supplier Dashboard | Widgets: total products, active products, pending orders, recent orders, inventory alerts |
| S6 | Add Product | Product creation form with images (Cloudinary), stock, price |
| S7 | Edit Product | Update existing product fields |
| S8 | Delete Product | Remove product from catalog |
| S9 | Update Inventory | Adjust stock quantity |
| S10 | Upload Product Images | Cloudinary upload integration |
| S11 | Mark Available/Out of Stock | Toggle product availability flag |
| S12 | View Incoming Orders | Order list scoped to supplier's products |
| S13 | View Order Details | Single order detail view |
| S14 | Update Order Status | Pending → Accepted → Preparing → Ready for Dispatch → Completed |
| S15 | Supplier Profile | View/edit business name, contact, address, hours |

## Cross-Cutting / Technical Requirements

| # | Requirement | Engineering Task |
|---|---|---|
| T1 | Responsive Web Design | Tailwind responsive breakpoints across all pages |
| T2 | Mobile-Friendly Experience | Test all core flows at mobile viewport |
| T3 | Authentication & Authorization | Auth.js/JWT + role-based route guards |
| T4 | Backend API | Next.js Route Handlers under `app/api/` |
| T5 | Database Integration | MongoDB Atlas + Mongoose models |
| T6 | Clean Project Structure | Feature-first structure per `04_FOLDER_STRUCTURE.md` |
| T7 | Reusable Components | Shared UI components in `components/` |
| T8 | State Management | React state/context; no external state library unless justified |
| T9 | Form Validation | Zod schemas in `validations/` used both client and server side |
| T10 | AI Integration | Hugging Face Inference API using marketplace DB as context |

## Explicitly Excluded

Payment processing, escrow, logistics/delivery workflows, and administrative dashboards are out of scope per the hackathon brief, and further restricted per `02_SCOPE.md`.
