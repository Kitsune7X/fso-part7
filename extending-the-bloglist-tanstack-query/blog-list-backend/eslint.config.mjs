import js from '@eslint/js';
import globals from 'globals';
import { defineConfig, globalIgnores } from 'eslint/config';
import stylistic from '@stylistic/eslint-plugin';
import noFloatingPromise from 'eslint-plugin-no-floating-promise';

export default defineConfig([
  globalIgnores(['dist/**']),
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: {
      js,
      '@stylistic': stylistic,
      'no-floating-promise': noFloatingPromise,
    },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.node },
  },
  { files: ['**/*.js'], languageOptions: { sourceType: 'module' } },
  {
    rules: {
      eqeqeq: 'error',
      'no-console': 'off',
      '@stylistic/indent': ['error', 2],
      '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
      '@stylistic/linebreak-style': ['error', 'unix'],
      'no-floating-promise/no-floating-promise': 2,
    },
  },
]);
