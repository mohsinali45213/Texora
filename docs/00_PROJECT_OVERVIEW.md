# 00 — Project Overview

## Vision

Build a functional prototype of a **B2B Textile Marketplace** that connects fabric **Buyers** and **Suppliers** through a single, modern, responsive Next.js web application. The prototype demonstrates the core marketplace loop — product discovery, cart, checkout (no payment), and order fulfillment — enhanced with an AI marketplace assistant for search, recommendations, comparison, and Q&A.

This is a **2-day hackathon MVP**, not a production platform. Every decision favors shipping speed and demo clarity over long-term scalability.

## Goals

- Demonstrate the complete **Buyer journey**: discover → view product → cart → checkout → order tracking.
- Demonstrate the complete **Supplier journey**: onboard → list products → manage inventory → receive and update orders.
- Integrate an **AI assistant** that uses real marketplace data (not hardcoded) for conversational search, recommendations, comparisons, and product Q&A.
- Ship a single deployable Next.js application on Vercel, backed by MongoDB Atlas, Cloudinary, and the Hugging Face Inference API.
- Keep the codebase clean, modular, and easy for both humans and AI coding agents to extend without breaking scope.

## Constraints

- **Team/time constraint**: 2-day build window. Every architectural choice must minimize setup and integration overhead.
- **Strict Scope Lock**: only features explicitly listed in `02_SCOPE.md` may be built. See `14_AGENT_RULES.md` for enforcement rules.
- **Single deployment target**: everything (frontend + backend/API) must live in one Next.js repo deployed to Vercel. No separate backend service.
- **No payments, no admin, no notifications** — see Out of Scope list in the hackathon brief and in `02_SCOPE.md`.
- **Two roles only**: Buyer and Supplier. No Admin role exists anywhere in the system.

## Success Criteria

A submission is successful if, in a single demo video and live deployed URL, a reviewer can:

1. Register and onboard as a **Buyer**, browse/search/filter products, use the AI assistant to find and compare products, add items to cart, complete a no-payment checkout, and view the resulting order in the Buyer Dashboard.
2. Register and onboard as a **Supplier**, view the Supplier Dashboard, create/edit/delete a product with images and stock, receive the order placed by the buyer above, and progress it through all order statuses (Pending → Accepted → Preparing → Ready for Dispatch → Completed).
3. Confirm that all of the above works on both desktop and mobile viewports.
4. Confirm the codebase structure matches `04_FOLDER_STRUCTURE.md` and business logic is not embedded in UI components.

## Non-Goals

Anything in the Out of Scope list of `02_SCOPE.md` (payments, escrow, logistics, admin dashboards, notifications, reviews, wishlists, coupons, multi-tenancy, microservices, CI/CD, etc.) is explicitly a non-goal for this repository and must not be designed, scaffolded, or partially implemented "for later."
