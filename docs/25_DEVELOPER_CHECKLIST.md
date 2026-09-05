# 25 — Developer Checklist (Pre-Merge)

Run through this before opening or merging any PR. Every item should be objectively checkable — if it isn't, it doesn't belong here.

## Project Setup

- [ ] `npm install` runs clean with no missing peer dependency errors.
- [ ] `.env.example` is up to date with any new environment variable introduced.
- [ ] `next build` succeeds locally with no TypeScript errors.

## Documentation

- [ ] Any new/changed API endpoint is reflected in `06_API_SPEC.md`.
- [ ] Any new/changed database field/collection is reflected in `05_DATABASE.md`.
- [ ] Any new/changed page/flow is reflected in `07_UI_FLOW.md`.
- [ ] Any new reusable component is reflected in `08_COMPONENTS.md`.
- [ ] Any new business rule is reflected in `09_BUSINESS_RULES.md`.
- [ ] Any new constant is added to `23_CONSTANTS.md`, not left inline.
- [ ] Progress reflected in `27_PROJECT_ROADMAP.md`.

## API

- [ ] Route handler is thin (parse → validate → call service → respond) — no business logic or direct Mongoose calls inline.
- [ ] Correct HTTP method and status codes per `06_API_SPEC.md` / `18_ERROR_HANDLING.md`.
- [ ] Response shape matches the standard format (`15_CODING_STANDARDS.md`).
- [ ] `runtime = "nodejs"` set if the route uses Mongoose/Cloudinary/Hugging Face.

## Validation

- [ ] Zod schema exists in `validations/` for every new write endpoint's request body.
- [ ] Server-side validation runs before any database write — no bypass path.
- [ ] Client form uses the same schema via `react-hook-form` resolver.

## Types

- [ ] No new `any` without a justifying comment.
- [ ] Shared types live in `types/`, not redefined locally.
- [ ] Mongoose model has a corresponding TypeScript interface.

## Testing

- [ ] Relevant checklist items in `12_TESTING.md` manually verified.
- [ ] Happy path and at least one failure path (invalid input, unauthorized access, insufficient stock, etc.) both tested by hand.
- [ ] Tested as both roles if the feature could be reached by either (e.g., role-guard correctness).

## Responsiveness

- [ ] Verified at mobile width (~375px) and desktop width.
- [ ] No horizontal overflow/broken layout on small screens.
- [ ] Matches spacing/typography/component rules in `19_UI_GUIDELINES.md`.

## Error Handling

- [ ] Loading, empty, and error states implemented for any new list/data view.
- [ ] Errors surfaced to the user per `18_ERROR_HANDLING.md` (inline field errors vs. toast vs. fallback UI, as appropriate).
- [ ] No unhandled promise rejections or uncaught exceptions in the browser console during manual testing.

## Accessibility

- [ ] Interactive elements are real `button`/`a`/`input` elements, keyboard-operable.
- [ ] Images have meaningful `alt` text.
- [ ] Form fields have associated labels.
- [ ] Status/availability indicators pair color with text, not color alone.

## Deployment

- [ ] Works against the deployed Vercel preview (not just `localhost`) before merging to `main`.
- [ ] No new environment variable missing from Vercel project settings.
- [ ] `13_DEPLOYMENT.md` updated if a new external service or env var was introduced.

## Cleanliness

- [ ] No `TODO` comments left without a corresponding entry in `27_PROJECT_ROADMAP.md`.
- [ ] No `console.log` left in committed code (use `lib/logger.ts` where server-side logging is genuinely needed).
- [ ] No dead code (unused functions, commented-out blocks, unused files).
- [ ] No unused imports or variables (TypeScript/linter should catch these — resolve, don't suppress).
- [ ] No out-of-scope feature introduced, per `02_SCOPE.md` and `14_AGENT_RULES.md`.

## Final Check

- [ ] If this PR were the last one before submission, would the demo video walkthrough for this feature go smoothly? If not, it isn't done yet.
