// Builds the precompiled CSS that ships next to the ng-packagr output:
//   dist/fonts.css  - self-hosted Inter @font-face rules, font files in dist/fonts/
//   dist/styles.css - fonts + tokens + kit base styles + kit utilities, no Tailwind needed in the app
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import tailwind from '@tailwindcss/postcss';
import postcss from 'postcss';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, 'dist');
const require = createRequire(join(root, 'package.json'));

const FONT_WEIGHTS = [400, 500, 600];

function buildFonts() {
  mkdirSync(join(dist, 'fonts'), { recursive: true });
  return FONT_WEIGHTS.map((weight) => {
    const source = require.resolve(`@fontsource/inter/${weight}.css`);
    return readFileSync(source, 'utf8').replace(/url\(\.\/files\/([^)]+)\)/g, (_, file) => {
      copyFileSync(join(dirname(source), 'files', file), join(dist, 'fonts', file));
      return `url(./fonts/${file})`;
    });
  }).join('\n');
}

async function buildStyles() {
  const input = join(root, 'src/styles/styles.build.css');
  const result = await postcss([tailwind({ base: join(root, 'src/lib'), optimize: { minify: true } })]).process(
    readFileSync(input, 'utf8'),
    { from: input },
  );
  return result.css;
}

const fonts = buildFonts();
writeFileSync(join(dist, 'fonts.css'), fonts);
writeFileSync(join(dist, 'styles.css'), fonts + '\n' + (await buildStyles()));
console.log('Built dist/styles.css and dist/fonts.css');
