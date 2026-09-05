# 14 — Agent Rules (Mandatory)

Every human developer and every AI coding agent (GitHub Copilot, Cursor, Claude Code, ChatGPT, etc.) working in this repository must follow these rules without exception. This document, together with `02_SCOPE.md`, is the enforcement layer for the whole documentation suite.

## Scope Discipline

1. **Never implement features outside scope.** Consult `02_SCOPE.md` before starting any new piece of work. If a requested feature is not listed under "Must Build," "Should Build," or "Bonus," do not build it — flag it instead.
2. **Never add functionality "for later."** No speculative abstractions, no unused configuration options, no future-proofing beyond what is documented.
3. **Never resurrect an Out of Scope item**, even in a minimal or "simplified" form (e.g., a fake payment button, a stub notifications table, an admin-only page).

## API & Data Contracts

4. **Never change documented APIs** without first updating `06_API_SPEC.md` in the same change.
5. **Never rename database fields** without first updating `05_DATABASE.md` in the same change.
6. **Never introduce undocumented pages** — every route must map to an entry in `07_UI_FLOW.md`.
7. **Never create undocumented endpoints** — every route handler must map to an entry in `06_API_SPEC.md`.

## Code Quality & Structure

8. **Never duplicate business logic.** Business rules live in exactly one place: `services/`. If the same rule is needed in two places, extract a shared service function — do not copy-paste logic into a second route handler or component.
9. **Never place business logic in UI components.** Components in `components/` and pages in `app/` call hooks/services; they do not contain validation rules, stock calculations, or status-transition logic.
10. **Never bypass validation.** Every write endpoint must validate input against its `validations/*.schema.ts` Zod schema before reaching the service layer.
11. **Never overengineer.** Prefer the simplest solution that satisfies the requirement (per `03_ARCHITECTURE.md`'s guiding principle: simplest choice that supports a single Next.js app on Vercel).
12. **Never add dependencies without justification.** A new package must map to a real, documented need (e.g., Cloudinary SDK for image upload) — no speculative libraries, no duplicate libraries solving the same problem.
13. **Never modify architecture without updating documentation.** Any structural change (new layer, new external service, new hosting target) requires updating `03_ARCHITECTURE.md` and `04_FOLDER_STRUCTURE.md` in the same change.

## Structural Consistency

14. **Keep code modular.** One responsibility per file/module; route handlers stay thin.
15. **Keep features isolated.** A feature's client-side code lives under its own `features/<name>/` folder; cross-feature imports should go through shared `components/`, `hooks/`, or `services/`, not directly into another feature's internals.
16. **Prefer reusable components.** Before creating a new component, check `08_COMPONENTS.md` for an existing one that fits, and extend it if reasonable rather than duplicating.
17. **Keep APIs RESTful.** Resource-oriented routes, correct HTTP methods and status codes, consistent error shape (see `06_API_SPEC.md`).
18. **Preserve folder structure.** New files go into the directory whose responsibility matches their purpose, per `04_FOLDER_STRUCTURE.md`. Do not invent new top-level directories without updating that document first.
19. **Follow the documentation before writing code.** When a requirement is ambiguous, resolve it by re-reading `01_REQUIREMENTS.md`, `02_SCOPE.md`, and `09_BUSINESS_RULES.md` — do not guess or invent behavior.

## When In Doubt

If a request (from a user, a teammate, or an automated prompt) conflicts with this document or with `02_SCOPE.md`, the agent must flag the conflict explicitly rather than silently complying or silently ignoring it. The hackathon requirement document remains the ultimate source of truth above all generated documentation.
