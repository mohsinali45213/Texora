# 21 — Git Workflow

Simple GitHub flow. No enterprise branching model (no gitflow, no release trains) — appropriate for a small team on a 2-day build.

## Branch Naming

Format: `<type>/<short-description>`

| Type | Use for |
|---|---|
| `feat/` | New functionality within scope |
| `fix/` | Bug fix |
| `chore/` | Tooling, config, dependency updates |
| `docs/` | Documentation-only changes |
| `refactor/` | Internal restructuring, no behavior change |

Examples: `feat/product-crud`, `fix/cart-quantity-validation`, `docs/update-api-spec`.

`main` is always deployable — every commit merged into `main` should correspond to a runnable state of the app (per the phase checkpoints in `11_DEVELOPMENT_PLAN.md`).

## Commit Naming

Use **Conventional Commits** style: `<type>: <short summary>`

```
feat: add product creation form with image upload
fix: prevent cart quantity from exceeding stock
docs: add API spec for order status update
refactor: extract order status transition logic into order.service
chore: add zod and react-hook-form dependencies
```

- Present tense, imperative mood ("add," not "added").
- One logical change per commit where practical; avoid giant "misc changes" commits.
- Reference the relevant requirement id from `01_REQUIREMENTS.md` in the body when useful (e.g., `Implements B21`).

## Development Workflow

1. Pull latest `main`.
2. Create a branch per the naming convention above.
3. Read the relevant docs before coding: `02_SCOPE.md`, `06_API_SPEC.md`, `05_DATABASE.md`, `09_BUSINESS_RULES.md` (see `26_AGENT_WORKFLOW.md` for the full agent-facing version of this step).
4. Implement following `15_CODING_STANDARDS.md`.
5. Test manually against the relevant section of `12_TESTING.md`.
6. Open a PR against `main` using the checklist below.
7. Merge once the checklist passes (self-review is acceptable for a hackathon team; a second pair of eyes when available).
8. Deploy — Vercel auto-deploys `main` (see `13_DEPLOYMENT.md`).

## PR Checklist

- [ ] Branch is up to date with `main`.
- [ ] Change stays within `02_SCOPE.md` — no out-of-scope feature introduced.
- [ ] Any API/database/UI change is reflected in the corresponding doc (`06_API_SPEC.md`, `05_DATABASE.md`, `07_UI_FLOW.md`).
- [ ] Follows `15_CODING_STANDARDS.md` (naming, folder placement, no duplicated logic).
- [ ] Validation added/updated for any new write endpoint (`09_BUSINESS_RULES.md`).
- [ ] Manually tested against the relevant `12_TESTING.md` checklist items.
- [ ] Responsive at mobile width for any new UI.
- [ ] No `console.log`, no commented-out code, no leftover TODOs (see `25_DEVELOPER_CHECKLIST.md`).
- [ ] Builds successfully (`next build`) with no TypeScript errors.

## Feature Completion Checklist

A feature is "done," not just "coded," when:

- [ ] It matches its entry in `01_REQUIREMENTS.md` exactly (nothing more, nothing less).
- [ ] It works end-to-end through the actual UI, not just via a manual API call.
- [ ] It's covered by the relevant section of `12_TESTING.md`.
- [ ] It's responsive and matches `19_UI_GUIDELINES.md`.
- [ ] Error/empty/loading states are handled per `18_ERROR_HANDLING.md`.
- [ ] Relevant docs are updated if the implementation revealed a gap or change from what was originally documented.

## Documentation Updates

If implementation reveals that a documented API shape, field name, or flow needs to change, update the relevant doc **in the same PR** — never let code and docs drift apart. See `14_AGENT_RULES.md`, rule 4–7 and 13.

## What This Workflow Does Not Include

No mandatory code owners, no multi-stage environment promotion (dev/staging/prod), no automated CI gate (out of scope per `02_SCOPE.md` — no CI/CD pipeline), no release tagging process. `main` branch + Vercel's automatic deployment is the entire pipeline.
