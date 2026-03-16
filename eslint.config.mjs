import { fileURLToPath } from 'node:url';

import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import eslintConfigPrettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

export default [
  {
    ignores: ['coverage/**', 'dist/**', 'docs/**', 'node_modules/**'],
  },
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: rootDir,
        sourceType: 'module',
      },
      globals: {
        Buffer: 'readonly',
        __dirname: 'readonly',
        clearInterval: 'readonly',
        console: 'readonly',
        process: 'readonly',
        require: 'readonly',
        setInterval: 'readonly',
        setTimeout: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...eslintConfigPrettier.rules,
      'prettier/prettier': 'error',
    },
  },
];
