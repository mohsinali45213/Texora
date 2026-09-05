# 02 — Scope (Authoritative)

This document is the single authoritative reference for what is in and out of scope. If any other document conflicts with this one, this document wins — after the original hackathon brief itself.

## Must Build

**Auth & Roles**
- Register / Login / Logout for Buyer and Supplier
- Role-based access control (Buyer, Supplier — no Admin)

**Buyer**
- Buyer onboarding (business type, industry, category interests, preferred fabrics, order quantity, budget range)
- Marketplace homepage (featured products, categories)
- Search, filter, product grid
- Product details page
- Shopping cart (add/update/remove)
- Checkout without payment (shipping info → summary → review → place order → confirmation)
- Buyer dashboard (profile, past/current orders, order status)

**Supplier**
- Supplier onboarding (business name, type, contact, address, hours, categories, fabric types, MOQ)
- Supplier dashboard (total/active products, pending orders, recent orders, inventory alerts)
- Product CRUD, image upload, stock update, availability toggle
- Order list, order detail, order status update
- Supplier profile

**AI**
- Conversational chat assistant using marketplace product data
- Voice input for chat (speech-to-text)
- Natural language search
- Product recommendations
- Product comparison
- Similar product suggestions
- Product Q&A

**Technical**
- Responsive design (desktop, tablet, mobile)
- Next.js Route Handlers as the only backend
- MongoDB Atlas + Mongoose
- Cloudinary for images
- Hugging Face Inference API for AI
- Single Vercel deployment

## Should Build

These improve demo quality but can be trimmed first if time runs short:

- Basic profile editing beyond the minimum fields
- Inventory alert thresholds (e.g., low-stock badge)
- Mock/sample order history seeding for demo purposes
- Loading and empty states across all list views
- Basic client + server form validation via shared Zod schemas

## Bonus (Only After Must Build Is Complete)

- Polished onboarding via conversational/voice UI instead of a plain form
- Voice-based AI assistant beyond basic speech-to-text (e.g., spoken responses)
- Enhanced AI product comparison UI (side-by-side cards)
- Minor UI/UX delight: skeleton loaders, subtle animations, empty-state illustrations
- Accessibility improvements (keyboard navigation, ARIA labels)

Bonus items must never be started before all "Must Build" items are functional end-to-end.

## Out of Scope (Never Build)

Per the hackathon brief and the strict scope lock, the following must **never** be designed, scaffolded, or implemented, even partially:

Payment Gateway · Escrow · Wallet · Logistics · Delivery Tracking · Shipment Management · Admin Dashboard · Admin Panel · Notifications · Emails · SMS · Push Notifications · Reviews · Ratings · Wishlist · Coupons · Discounts · Refunds · Returns · Invoice Generation · Tax System · Multi-Vendor Finance · CRM · ERP · Analytics Platform · Reporting Dashboard · OAuth Providers · Audit Logs · Activity Feed · Real-time Chat (peer-to-peer) · WebSockets · Background Workers · Redis · Elasticsearch · Docker · Kubernetes · Microservices · CI/CD pipelines · Multi-language support · Multi-tenancy · AI Agents / Autonomous Workflows / AI Memory / Multi-Agent Systems / Analytics AI / AI Automation

Order status is restricted to exactly: **Pending, Accepted, Preparing, Ready for Dispatch, Completed**. No payment status, no cancellation, no refund status of any kind.

## Scope Change Process

Any change to this document requires the requirement to first appear in the hackathon brief. AI coding agents must never add scope on their own initiative — see `14_AGENT_RULES.md`.
