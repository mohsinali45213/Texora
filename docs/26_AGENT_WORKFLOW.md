# 26 — Agent Workflow

The mandatory operating procedure for every AI coding agent (Claude Code, Cursor, Copilot, ChatGPT, etc.) working in this repository, for every task. This document operationalizes `14_AGENT_RULES.md`.

## The Workflow (Every Task, No Exceptions)

1. **Read Scope** — Open `02_SCOPE.md`. Confirm the requested task falls under "Must Build," "Should Build," or approved "Bonus." If it doesn't appear there or in `01_REQUIREMENTS.md`, stop and flag it (see "When to Refuse Changes" below).
2. **Read API** — Open `06_API_SPEC.md`. Check whether the endpoint(s) involved already exist. If modifying one, note its current contract exactly.
3. **Read Database** — Open `05_DATABASE.md`. Check the relevant collection's existing fields before adding or changing any.
4. **Read Business Rules** — Open `09_BUSINESS_RULES.md`. Identify which rules govern this task (role permissions, validation, status transitions, etc.).
5. **Plan implementation** — Write a short plan (even just a mental/comment-level one) identifying: which files will be touched, whether any new file is needed, and which existing service/repository/component can be reused. Cross-check against `04_FOLDER_STRUCTURE.md` for correct placement and `08_COMPONENTS.md` for reusable UI pieces.
6. **Implement** — Follow `15_CODING_STANDARDS.md`, `16_STATE_MANAGEMENT.md`, `17_SECURITY.md`, `18_ERROR_HANDLING.md`, and `19_UI_GUIDELINES.md` as applicable to the task.
7. **Validate** — Confirm Zod validation exists for any new write path (per `09_BUSINESS_RULES.md`), and that role/ownership checks are enforced server-side (per `17_SECURITY.md`).
8. **Test** — Manually verify against the relevant items in `12_TESTING.md`; run `next build` to confirm no type errors.
9. **Update docs if required** — If the implementation changed or clarified an API shape, database field, UI flow, or business rule, update the corresponding document in the same change, per `14_AGENT_RULES.md` rules 4–7 and `21_GIT_WORKFLOW.md`.

Skipping steps 1–4 is the most common source of scope creep and inconsistency — an agent that starts writing code before reading these four documents is working from assumption, not from the source of truth.

## When to Stop

Stop and surface the issue to the user/developer, without writing code, when:

- The requested feature does not appear in `02_SCOPE.md` or `01_REQUIREMENTS.md`.
- The request would touch anything in the Out of Scope list (`02_SCOPE.md`).
- The request conflicts with an existing documented API contract, database field, or business rule, and resolving the conflict requires a decision only the user/developer can make.
- The request is ambiguous enough that two reasonable implementations would produce meaningfully different behavior (not just different code style).

## When to Ask Questions

Ask exactly one focused clarifying question (not a list) when:

- A requirement in `01_REQUIREMENTS.md` is described at a level that leaves a genuine implementation choice open (e.g., an unspecified default value, an unspecified UI copy string) **and** guessing wrong would require rework rather than a trivial edit.
- Otherwise, prefer making the most reasonable assumption, stating it explicitly in the response/commit message, and proceeding — most ambiguity in this documentation suite has a clear "simplest option that satisfies the requirement" answer per `03_ARCHITECTURE.md`'s guiding principle.

## When to Refuse Changes

Refuse (explain why, do not silently comply, do not silently ignore) when a request would:

- Add an Out of Scope feature (payments, admin panel, notifications, etc.).
- Introduce a new external service/dependency not already listed in `03_ARCHITECTURE.md`/`24_ARCHITECTURE_DECISIONS.md` without updating those documents first.
- Rename a documented API path or database field without updating `06_API_SPEC.md`/`05_DATABASE.md` in the same change.
- Place business logic inside a UI component or route handler instead of `services/`.
- Bypass validation or role/ownership checks "to save time."

## How to Estimate Scope

Before implementing, size the task against `11_DEVELOPMENT_PLAN.md`'s phases:

- Does it belong entirely within one phase (e.g., a small fix to Phase 3's product CRUD)? → Implement directly.
- Does it span multiple phases (e.g., a change to the `Product` schema affects cart, orders, and AI context)? → Identify every downstream file that references the changed shape (search the codebase, not just memory) before editing, and update all of them in the same change.
- Does it look larger than a single focused PR per `21_GIT_WORKFLOW.md`? → Break it down (see below) rather than attempting one large, hard-to-review change.

## How to Avoid Feature Creep

- Implement exactly what `01_REQUIREMENTS.md` / the specific task describes — no "while I'm here" additions, even small ones (an extra field, an extra button, an extra page).
- If a genuinely good idea surfaces mid-task that isn't in scope, note it for `27_PROJECT_ROADMAP.md` or a future scope discussion — do not implement it inline.
- Re-read the task against `02_SCOPE.md`'s Out of Scope list specifically before considering it complete; it's easy to accidentally drift toward an adjacent out-of-scope feature (e.g., building "order cancellation" while implementing order status updates).

## How to Break Large Tasks Into Smaller Ones

1. Identify the data layer change first (model/schema), if any — smallest independent unit.
2. Then the service/repository logic that depends on it.
3. Then the API route(s) that expose it.
4. Then the UI that consumes it.
5. Land each as its own commit (or PR, if large enough) in that order, per `21_GIT_WORKFLOW.md`, so each step is independently reviewable and the app remains buildable after every commit where possible.

## How to Reuse Existing Code Before Creating New Files

- Before creating a new component, check `08_COMPONENTS.md` for an existing one that fits or can be reasonably extended via props.
- Before creating a new service function, check the relevant `services/*.service.ts` file for an existing function that already implements the needed logic (e.g., stock validation likely already exists in `product.service.ts` or `cart.service.ts` — reuse it rather than reimplementing).
- Before adding a new constant, check `23_CONSTANTS.md` first.
- Before adding a new Zod schema, check `validations/` for an existing schema that can be extended/reused (e.g., a `.partial()` version of a create schema for updates, rather than a hand-written duplicate).
- Only create a new file when no existing one reasonably covers the responsibility — per `04_FOLDER_STRUCTURE.md`'s directory responsibilities, not as a default first move.
