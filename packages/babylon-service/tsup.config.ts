import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/types/index.ts'
  ],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: 'lib',
  target: 'es2020',
  external: [
    'fs',
    'fs/promises',
    'path'
  ],
  esbuildOptions(options, context) {
    delete options.packages;
  },
});