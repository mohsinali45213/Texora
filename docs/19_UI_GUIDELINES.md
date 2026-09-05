# 19 — UI Guidelines

Visual consistency rules built on **TailwindCSS + shadcn/ui**, per `03_ARCHITECTURE.md`. These constrain styling decisions so every page looks like part of the same product without a dedicated design system.

## Foundation

- Use **shadcn/ui** primitives (`Button`, `Card`, `Input`, `Select`, `Dialog`, `Badge`, `Tabs`, `Skeleton`, `Toast`, etc.) wherever a matching component exists — do not hand-roll a custom button/input/card style.
- Tailwind's default spacing/typography/color scale is the source of truth; avoid arbitrary one-off values (`mt-[13px]`) unless solving a genuine edge case.

## Spacing

- Page-level horizontal padding: `px-4` mobile, `px-6` tablet (`md:`), `px-8` desktop (`lg:`).
- Section vertical rhythm: `py-8` to `py-12` between major page sections (e.g., Featured Products, Categories on the landing page).
- Card/grid gaps: `gap-4` mobile, `gap-6` desktop.
- Form field vertical spacing: `space-y-4` within a form.

## Typography

- One font family across the app (Tailwind default `font-sans` unless the team picks a specific Google Font — document the choice here once decided).
- Heading scale: `text-3xl font-bold` (page titles) → `text-xl font-semibold` (section headings) → `text-base font-medium` (card titles) → `text-sm text-muted-foreground` (meta/secondary text).
- Body copy: `text-sm` to `text-base`, `text-foreground` for primary content, `text-muted-foreground` for secondary/help text.

## Cards

- `ProductCard`, `StatCard`, and order rows all use the shadcn `Card` component as their base for consistent padding/border/radius/shadow.
- Standard card padding: `p-4`; image area uses a fixed aspect ratio (`aspect-square` or `aspect-[4/3]`) so grids stay visually aligned regardless of source image dimensions.

## Buttons

- Primary action per screen: `variant="default"` (solid), used once per view (e.g., "Add to Cart," "Place Order," "Save Product").
- Secondary/tertiary actions: `variant="outline"` or `variant="ghost"`.
- Destructive actions (Delete Product): `variant="destructive"`, always behind a confirmation `Dialog` — never delete on a single click.
- Icon-only buttons (mobile nav, remove-from-cart) always include an `aria-label`.

## Forms

- Every input uses the shared `FormField` component (`08_COMPONENTS.md`) — label above input, error message below in `text-destructive text-sm`.
- Multi-step forms (onboarding, checkout) use `StepIndicator` at the top and keep exactly one step visible at a time.
- Disable the submit button and show a spinner/label change (e.g., "Saving...") while a submission is in flight; never allow a double-submit.

## Colors

- Use shadcn/ui's theme tokens (`background`, `foreground`, `primary`, `muted`, `destructive`, `border`, etc.) rather than raw Tailwind color classes (`bg-blue-500`) so the app has one adjustable theme surface.
- Status colors for `OrderStatusBadge` (semantic, not decorative):

| Status | Color intent |
|---|---|
| Pending | neutral/gray |
| Accepted | blue |
| Preparing | amber/yellow |
| Ready for Dispatch | purple/indigo |
| Completed | green |

- Availability badges: `isAvailable = true` → green "In Stock"; `false` → gray/red "Out of Stock".

## Loading States

- List/grid pages show `Skeleton` placeholders matching the shape of the eventual content (card outlines for `ProductGrid`, row outlines for `OrderTable`) — never a blank screen or a generic spinner for content-heavy views.
- Small inline actions (button submit, chat send) show a spinner inside the button itself, not a full-page overlay.

## Skeletons

- One shared `Skeleton` primitive from shadcn/ui, composed into per-content skeletons (`ProductCardSkeleton`, `OrderRowSkeleton`) that mirror real layout dimensions to avoid layout shift when data arrives.

## Empty States

- Every list view defines an empty state with: a short message, an optional icon/illustration, and a relevant CTA (e.g., "No products yet — Add your first product" for supplier inventory; "No orders yet — Browse the marketplace" for buyer orders).
- Empty states are visually distinct from error states (see `18_ERROR_HANDLING.md`) — empty means "no data," error means "something went wrong."

## Responsive Rules

- Mobile-first Tailwind breakpoints: base styles target mobile (~375px), then layer `md:` (tablet, ≥768px) and `lg:` (desktop, ≥1024px).
- `Navbar` collapses into `MobileMenu` below `md:`.
- `ProductGrid`: 1 column mobile, 2 columns `sm:`/`md:`, 3–4 columns `lg:`/`xl:`.
- Tables (`OrderTable`) either scroll horizontally on mobile (`overflow-x-auto`) or collapse into stacked cards below `md:` — pick one pattern and apply it consistently to every table in the app.
- `ChatWidget` becomes a full-screen sheet on mobile instead of a floating side panel, so it never overlaps critical content.

## Accessibility Basics

- All interactive elements are reachable and operable via keyboard (native `button`/`a`/`input` elements, not `div onClick`).
- Every image has meaningful `alt` text (product name at minimum); decorative icons use `aria-hidden`.
- Form inputs are always associated with a `label` (via `FormField`).
- Color is never the only signal for status — `OrderStatusBadge` and availability badges always pair color with text.
- Maintain sufficient contrast using shadcn/ui's default theme tokens (already tuned for accessible contrast) rather than overriding with low-contrast custom colors.
- Modals/dialogs (delete confirmation, comparison panel on mobile) trap focus and are dismissible via `Esc`, per shadcn/ui `Dialog` defaults — do not override this behavior.

## Consistency Checklist for Any New Screen

- [ ] Uses shadcn/ui primitives, no hand-rolled buttons/inputs/cards.
- [ ] Follows the spacing scale above.
- [ ] Has loading, empty, and error states.
- [ ] Responsive at mobile/tablet/desktop.
- [ ] Keyboard-operable and labeled for accessibility.
