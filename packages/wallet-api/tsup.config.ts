import { defineConfig } from 'tsup'

export default defineConfig([
  // Main entry
  {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    minify: false,
    outDir: 'dist',
  },
  // Types entry
  {
    entry: ['src/types/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: false,
    minify: false,
    outDir: 'dist/types',
  },
])
