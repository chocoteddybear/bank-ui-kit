// Guards the promise that loading the kit never changes a host app outside .skit-root.
// Runs against the built package, so `pnpm build` must run first.
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';

const dist = join(dirname(dirname(fileURLToPath(import.meta.url))), 'dist');
const stylesPath = join(dist, 'styles.css');

if (!existsSync(stylesPath)) {
  throw new Error('dist/styles.css not found. Run `pnpm build` before the tests.');
}

const css = readFileSync(stylesPath, 'utf8');
const root = postcss.parse(css);

// Tailwind's fallback for browsers without @property: it only defines --tw-* variables.
const inPropertiesLayer = (node) => {
  for (let p = node.parent; p; p = p.parent) {
    if (p.type === 'atrule' && p.name === 'layer' && p.params === 'properties') return true;
  }
  return false;
};

const rules = [];
root.walkRules((rule) => {
  if (rule.parent?.type === 'atrule' && rule.parent.name === 'keyframes') return;
  if (!inPropertiesLayer(rule)) rules.push(rule);
});

const TOKEN_SCOPE = /^(:root|:host|\[data-primary=[^\]]+\]|\[data-theme=[^\]]+\]|:root:not\(\[data-theme=light\]\))$/;
const KIT_SCOPE = /^(\.skit\\:|:where\(\.skit-root|:where\(\[data-theme)/;

test('every selector is a token scope, a skit: class, or scoped to .skit-root', () => {
  const offenders = rules.flatMap((rule) =>
    rule.selectors.filter((s) => !TOKEN_SCOPE.test(s) && !KIT_SCOPE.test(s)),
  );
  assert.deepEqual(offenders, []);
});

test('rules that can match the host page only define --skit-* variables', () => {
  const offenders = rules
    .filter((rule) => rule.selectors.some((s) => TOKEN_SCOPE.test(s)))
    .flatMap((rule) =>
      rule.nodes
        .filter((d) => d.type === 'decl' && !d.prop.startsWith('--skit-'))
        .map((d) => `${rule.selector} { ${d.prop} }`),
    );
  assert.deepEqual(offenders, []);
});

test('no global reset: no bare element, universal or html/body selectors', () => {
  const offenders = rules.flatMap((rule) =>
    rule.selectors.filter((s) => /^(\*|html|body|[a-z][a-z0-9]*)(\b|$)/.test(s)),
  );
  assert.deepEqual(offenders, []);
});

test('every font file referenced by the CSS is shipped', () => {
  const urls = [...css.matchAll(/url\(\.\/fonts\/([^)]+)\)/g)].map((m) => m[1]);
  assert.ok(urls.length > 0, 'expected Inter @font-face rules');
  assert.deepEqual(urls.filter((file) => !existsSync(join(dist, 'fonts', file))), []);
});
