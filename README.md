# skit

Angular UI kit for banking apps, published as `@vladlev/skit`. See `CLAUDE.md` for the design spec.

The library lives in `packages/ui`, together with its Storybook showroom.

```sh
pnpm install
pnpm storybook        # showroom (http://localhost:6006)
pnpm build            # build the library into packages/ui/dist
pnpm dev              # rebuild the library on change
pnpm lint
```

## Adding the kit to an app

The kit is built to drop into existing apps (Tailwind, Bootstrap, plain CSS) without changing them:
it ships no global reset, every class and variable is prefixed, and kit styles apply only inside `.skit-root`.
`Foundations / Compatibility` in Storybook checks this against simulated host apps.

Pick one stylesheet:

| File | When |
|---|---|
| `@vladlev/skit/styles.css` | Any app. Precompiled: tokens, Inter, plain-tag styles and the public `skit:` classes. No Tailwind needed. |
| `@vladlev/skit/tailwind.css` + `@vladlev/skit/fonts.css` | Tailwind v4 apps that want any `skit:` utility in their own templates. Add `tailwind.css` as its **own** stylesheet entry, not inside the app's Tailwind entry. |

Also load Angular CDK's `@angular/cdk/a11y-prebuilt.css` (skip it if your app already includes the CDK or Angular Material styles). `skit-spinner` announces through the CDK `LiveAnnouncer`, and without that stylesheet the announcement text is visible on the page.

Then opt a page in with `class="skit-root"`.

Theme attributes: `data-primary="indigo|teal|violet"`, `data-theme="light|dark"` (omit for system).
