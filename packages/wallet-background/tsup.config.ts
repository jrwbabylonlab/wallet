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
    '@unisat/keyring-service',
    '@unisat/permission-service',
    '@unisat/wallet-types',
    '@unisat/tx-helpers',
    '@unisat/wallet-api',
    '@unisat/wallet-bitcoin',
    '@unisat/babylon-service',
    '@unisat/contact-book',
    '@unisat/i18n'
  ]
});