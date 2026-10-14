# skit

Angular UI kit for banking apps. See `CLAUDE.md` for the design spec.

```sh
pnpm install
pnpm start            # demo app (projects/demo)
pnpm storybook        # library showroom (projects/ui)
pnpm build            # library + demo
pnpm lint
```

Tokens and base styles live in `projects/ui/src/lib/tokens` (`skit.css` is the entry).
Theme attributes on the root element: `data-primary="indigo|teal|violet"`, `data-theme="light|dark"` (omit for system).
