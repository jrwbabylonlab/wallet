import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    types: 'src/types/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: 'lib',
  target: 'es2020',
  external: [
    'events',
    'bip39',
    'bitcoinjs-lib',
    '@unisat/wallet-bitcoin',
    '@unisat/wallet-types',
    'fs',
    'fs/promises',
    'path',
  ],
})
