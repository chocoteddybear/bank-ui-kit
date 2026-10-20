# Atomic Design System (skit)

Angular UI kit for banking and financial apps, shown in a Storybook showroom. Portfolio demo for front-end roles, reusable across personal projects, and built to be adopted by existing Angular apps.

## Stack
- Angular 22+ (standalone components, signals, `input()` / `output()` / `model()`)
- Storybook, Tailwind CSS v4 (CSS-first config), pnpm
- pnpm workspace with two independent packages, not one Angular workspace:
  - `packages/ui`: the library, published as an npm package. Own `package.json` and Angular config. Storybook lives here.
  - `apps/demo`: a separate Angular app with its own `package.json` and `angular.json`. It consumes the library exactly like an external company app would: it depends on the built package (`workspace:*` link to the ng-packagr output) and imports only from the package name. No tsconfig path aliases to library source, no shared `angular.json`.
  - Switching the demo to the published npm version must be a one-line dependency change.

## Conventions
- Prefix: `skit` everywhere. Components `<skit-...>`, directives `skit...` (camelCase), CSS variables `--skit-...`, root class `.skit-root`, Tailwind prefix `skit:` (`@import "tailwindcss" prefix(skit);`). Demo app uses `app-`.
- Folders under `packages/ui/src/lib/`: `tokens`, `atoms`, `molecules`, `organisms`, `templates`. Dependencies only point downward.
- Pages live in the demo app, not the library.
- One folder per component: component, story, spec.
- Components use role tokens only (`primary-600`, `surface`, `text-muted`), never raw colors.
- State: UI state (open, focus, hover) stays inside the component. Data state belongs to the page or a service.
- Accessibility from day one: ARIA, keyboard navigation, visible focus ring. Use Angular CDK for overlays.
- Card number validation (Luhn, brand detection, CVV length) is a pure TypeScript utility, unit tested.

## Components
- One component per atom. Never separate components per size or variant (no `LargeButton`).
- Configured by inputs that describe design choices: `variant="primary"`, `size="lg"`. Inputs are typed unions so invalid values fail at build time.
- No inputs for raw CSS (no `border`, `color`, `radius` inputs). Rare customization goes through component CSS variables, e.g. `--skit-button-radius`.
- Component styles read design values only from `--skit-*` variables, with no hard-coded fallbacks (a fallback may only be another token: `var(--skit-button-radius, var(--skit-radius-full))`). `styles.css` (added by `ng add`) defines them; without it a component renders unstyled on purpose, so a broken setup is visible immediately.
- Component styles are self-contained (Angular style encapsulation) and do not depend on `.skit-root`, so a single component can be swapped into a legacy page.
- One naming rule, no exceptions: every atom is a `<skit-...>` tag, including button and form controls (Ionic model). No attribute directives on native elements for atoms.
- Each component renders its own correct inner markup and accessibility (roles, aria, labels).
- Form atoms (`skit-input`, `skit-select`, `skit-checkbox`, `skit-radio`, `skit-switch`) implement `ControlValueAccessor` so `formControlName` and `ngModel` work.
- Native attribute forwarding: form atoms forward `type`, `name`, `id`, `autocomplete`, `inputmode`, `placeholder`, `required`, `disabled`, `readonly`, `maxlength`, `minlength`, `pattern`, `aria-label`, `aria-describedby` to the inner native element. `skit-button` forwards `type`, `disabled` and `aria-label` (required for icon-only buttons). Every forwarded attribute has a test. Banking depends on this (card autofill `autocomplete="cc-number"`, numeric keyboard `inputmode="decimal"`).
- Host elements set an explicit `display` so the extra wrapper does not break layout.

## Styling approach for plain HTML
- Plain tags (`h1`-`h6`, `p`, `a`, lists, `hr`, `table`) are styled by default; no classes needed.
- These styles are deliberately weak:
  - placed in the `components` cascade layer: above any Tailwind reset (`@layer base`), below utilities, so any Tailwind class wins without `!important`
  - wrapped in `:where()`, so specificity is zero and any app CSS wins
  - scoped to `.skit-root`, so nothing outside it changes
- Each tag reads CSS variables with defaults, e.g. `font-size: var(--skit-h2-size, var(--text-2xl))`.
- Override ladder: class on the element → CSS variable on a container (`--skit-h2-size`) → leave `.skit-root`.
- Tailwind default sizes and weights are cleared in the theme (`--text-*: initial`, `--font-weight-*: initial`) so only kit variants exist. Lint rule blocks arbitrary values like `text-[17px]`.
- Typography variant classes for when the look differs from the tag: `text-display`, `text-heading-lg`, `text-heading`, `text-title`, `text-subtitle`, `text-body`, `text-body-sm`, `text-label`, `text-caption`.
- Default tag mapping: h1 heading-lg, h2 heading, h3 title, h4 subtitle, p body, small caption, label label.

## Integration into existing apps
- Target: Angular apps using the latest Tailwind.
- Distributed as an npm package with semver. `ng add` installs and configures (styles, font, root class). `ng update` ships migrations for breaking changes.
- The kit ships compiled CSS.
- The kit never overrides existing classes; old styles always win.
- Adoption is gradual, page by page or component by component.
- Migration rule: when a page moves to the kit, add `skit-root` AND delete its old classes in the same change. Never ship a half-migrated page.
- Token bridge: an app may map its brand onto kit variables (`--skit-primary-600: var(--their-brand)`) to start with its current look.

## Theming
- Default primary is indigo. Teal and violet ship as alternate presets.
- Switching = changing which scale `primary` points to (theme attribute on the root element).
- Dark mode follows the system setting (`prefers-color-scheme`) by default. `data-theme="light"` or `data-theme="dark"` on the root overrides it.
- Demo app has a picker with two controls: color (indigo, teal, violet) and mode (system, light, dark).

## Color tokens
Primary (indigo, default): 50 #eef2ff, 100 #e0e7ff, 200 #c7d2fe, 300 #a5b4fc, 400 #818cf8, 500 #6366f1, 600 #4f46e5, 700 #4338ca, 800 #3730a3, 900 #312e81, 950 #1e1b4b

Primary alt (teal): 50 #f0fdfa, 100 #ccfbf1, 200 #99f6e4, 300 #5eead4, 400 #2dd4bf, 500 #14b8a6, 600 #0d9488, 700 #0f766e, 800 #115e59, 900 #134e4a, 950 #042f2e

Primary alt (violet): 50 #f5f3ff, 100 #ede9fe, 200 #ddd6fe, 300 #c4b5fd, 400 #a78bfa, 500 #8b5cf6, 600 #7c3aed, 700 #6d28d9, 800 #5b21b6, 900 #4c1d95, 950 #2e1065

Neutral (cool slate): 50 #f8fafc, 100 #f1f5f9, 200 #e2e8f0, 300 #cbd5e1, 400 #94a3b8, 500 #64748b, 600 #475569, 700 #334155, 800 #1e293b, 900 #0f172a, 950 #020617

Semantic, light (bg / border / solid / text):
- success: #f0fdf4 / #bbf7d0 / #16a34a / #166534
- warning: #fffbeb / #fde68a / #d97706 / #92400e
- danger: #fef2f2 / #fecaca / #dc2626 / #991b1b
- info (sky, not blue, to stay distinct from indigo): #f0f9ff / #bae6fd / #0284c7 / #075985

Semantic, dark (bg / border / text; solid unchanged):
- success: #052e16 / #166534 / #86efac
- warning: #451a03 / #92400e / #fcd34d
- danger: #450a0a / #991b1b / #fca5a5
- info: #082f49 / #075985 / #7dd3fc

### Roles
| Role | Light | Dark |
|---|---|---|
| `background` (page) | neutral-50 | neutral-950 |
| `surface` (cards) | white | neutral-900 |
| `border` | neutral-200 | neutral-800 |
| `text-default` | neutral-900 | neutral-50 |
| `text-muted` | neutral-500 | neutral-400 |
| Primary button | primary-600, white text | primary-600, white text |
| Links, focus ring | primary-600 / primary-500 | primary-400 |
| Tinted badge and alert | 50-100 bg, 800 text | 950 bg, 300 text |

- Tints (badges, alerts) flip with the mode. Primary button never changes.
- Dark depth: raised surfaces are lighter than the page. Still no shadows.

### Money amounts
No red or green. Deposits and purchases both use `text-default`; direction is shown by the sign (`+$3,200.00`, `-$84.20`). Red is reserved for real problems (errors, overdrafts). The `Amount` atom always shows the sign and uses tabular numerals.

## Typography
- Inter only (self-hosted, weights 400 / 500 / 600), tabular numerals on amounts.
- Scale (size/line-height): xs 12/16, sm 14/20, base 16/24, lg 18/28, xl 20/28, 2xl 24/32, 3xl 30/36, 4xl 36/40.
- Variants: display 4xl/600, heading-lg 3xl/600, heading 2xl/600, title xl/500, subtitle lg/500, body base/400, body-sm sm/400, label sm/500, caption xs/400.
- Optional mono token for card numbers and IBANs, added when the card number field is built.

## Layout tokens (Revolut-inspired)
- Spacing: 4px base. Steps 4, 8, 12, 16, 24, 32, 48, 64.
- Radius: none 0, sm 8 (tags), md 12 (inputs), lg 20 (cards), full 9999 (buttons, pills).
- Borders: 1px solid `border` role for cards, inputs, dropdowns. Strong 1px neutral-900 for outline buttons.
- No shadows. Depth comes from surface color, borders, and a dark scrim behind modals and drawers. Dropdowns and popovers use `surface` with the standard 1px border.

## Interaction tokens
- Focus ring (keyboard only, `:focus-visible`): 2px ring with a 2px gap matching the page background.
- Motion: fast 120ms (hover, press), base 200ms (menus, toggles), slow 320ms (modals, drawers). One easing: `cubic-bezier(0.2, 0, 0, 1)`. Respect `prefers-reduced-motion`.

## v1 atom list
| Atom | Tag | Key inputs |
|---|---|---|
| Button | `<skit-button>` | variant (primary, secondary, outline, ghost, danger), size (sm, md, lg), loading, type, disabled |
| Text input | `<skit-input>` | size, native attributes forwarded; invalid state from Angular forms |
| Select | `<skit-select>` | size; wraps a native `<select>` (keyboard, screen readers, positioning come from the browser). Closed state fully styled (`appearance: none` + Lucide chevron). Open list styled with `appearance: base-select` / `::picker(select)` where supported (Chromium 135+), only on `(pointer: fine)` so phones keep the native picker; other browsers fall back to the OS list. |
| Checkbox | `<skit-checkbox>` | none beyond forms |
| Radio | `<skit-radio>` | value |
| Switch | `<skit-switch>` | none beyond forms (renders `role="switch"`) |
| Icon | `<skit-icon>` | name (typed list of the kit's curated icons), size, label (makes it meaningful; decorative and hidden from screen readers without it); uses Lucide (`@lucide/angular`), wrapped so the set can be swapped later |
| Badge | `<skit-badge>` | tone (neutral, primary, success, warning, danger, info) |
| Avatar | `<skit-avatar>` | src, name (required: accessible name and initials fallback, also when the image fails), size |
| Spinner | `<skit-spinner>` | size, label (renders `role="status"`, announces the label via CDK LiveAnnouncer) |
| Skeleton | `<skit-skeleton>` | width, height (number = px, or a CSS length), shape (text, rect, circle); hidden from screen readers |
| Amount | `<skit-amount>` | value (number, or decimal string for exact amounts), currency (ISO code), size; always signed, tabular numerals, app locale; screen readers hear "plus"/"minus" |

Text, Label, and Divider are not components: plain tags and typography classes cover them.

## Organism notes
- Account card: account name on the left of the header, badge on the right.

## Working style
- Keep explanations short. Do not describe options that were not asked for.
- Explain the reasoning behind decisions, not just the result.
