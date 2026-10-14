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

Tokens and base styles live in `packages/ui/src/lib/tokens` (`skit.css` is the entry).
Theme attributes on the root element: `data-primary="indigo|teal|violet"`, `data-theme="light|dark"` (omit for system).
