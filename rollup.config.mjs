import { createRequire } from 'node:module';

import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import sourceMaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';
import json from '@rollup/plugin-json';
import sass from 'rollup-plugin-sass';
import autoprefixer from 'autoprefixer';
import postcss from 'postcss';
import terser from '@rollup/plugin-terser';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

const libraryName = pkg.name.includes('/') ? pkg.name.split('/')[1].toLowerCase() : pkg.name.toLowerCase();

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      name: libraryName,
      format: 'umd',
      sourcemap: true,
    },
    { file: pkg.module, format: 'es', sourcemap: true },
  ],
  external: [],
  watch: {
    include: 'src/**',
  },
  plugins: [
    sass({
      output: `dist/${libraryName}.css`,
      processor: css =>
        postcss([autoprefixer()])
          .process(
            css,
            { from: undefined }, // fix PostCSS without `from` warning
          )
          .then(result => result.css),
    }),
    json(),
    typescript({
      tsconfig: './tsconfig.json',
      clean: true,
      useTsconfigDeclarationDir: false,
      tsconfigOverride: {
        compilerOptions: {
          declaration: false,
          declarationMap: false,
        },
      },
    }),
    resolve({
      preferBuiltins: true,
    }),
    commonjs({
      include: 'node_modules/**',
    }),
    sourceMaps(),
    terser(),
  ],
};
