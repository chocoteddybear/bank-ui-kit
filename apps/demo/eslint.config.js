// @ts-check
const eslint = require('@eslint/js');
const { defineConfig } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const betterTailwind = require('eslint-plugin-better-tailwindcss');

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
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
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
      'better-tailwindcss': { entryPoint: 'src/styles.css' },
    },
    rules: {
      ...betterTailwind.configs['correctness-error'].rules,
      'better-tailwindcss/no-unknown-classes': ['error', { ignore: ['^skit-root$', '^app-'] }],
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
]);
