import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
  minify: false,
  treeshake: true,
  external: [
    'react',
    'react-redux',
    '@reduxjs/toolkit',
    '@unisat/wallet-types'
  ]
});