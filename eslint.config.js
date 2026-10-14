// @ts-check
const eslint = require('@eslint/js');
const { defineConfig } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const betterTailwind = require('eslint-plugin-better-tailwindcss');
const storybook = require('eslint-plugin-storybook');

module.exports = defineConfig([
  {
    ignores: ['dist/**', '.angular/**', 'out-tsc/**'],
  },
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'skit',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'skit',
          style: 'kebab-case',
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    plugins: { 'better-tailwindcss': betterTailwind },
    settings: {
      'better-tailwindcss': { entryPoint: 'projects/ui/src/lib/tokens/skit.css' },
    },
    rules: {
      ...betterTailwind.configs['correctness-error'].rules,
      'better-tailwindcss/no-unknown-classes': ['error', { ignore: ['^skit-root$'] }],
      'better-tailwindcss/no-restricted-classes': [
        'error',
        {
          restrict: [
            {
              pattern: '\\[.*\\]',
              message: 'Arbitrary values are not allowed. Use a kit token or a component CSS variable.',
            },
          ],
        },
      ],
    },
  },
  ...storybook.configs['flat/recommended'],
]);
