import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/types/index.ts',
    'src/adapters/memory.ts',
    'src/adapters/extensionPersist.ts',
    'src/adapters/filesystem.ts'
  ],
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
    'path'
  ],
});