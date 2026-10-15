import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Angular bundles each spec together with the code it tests. Vitest's persistent module cache
    // keys on the spec bundle and would replay stale results after a component-only change.
    fsModuleCache: false,
  },
});
