import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./test/setup.ts'],
    include: ['packages/**/test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', 'build'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      include: ['packages/**/src/**/*.{js,ts}'],
      exclude: [
        'packages/**/test/**/*.{test,spec}.{js,ts}',
        'packages/**/src/**/index.ts',
        'packages/**/dist/**',
      ],
    },
    testTimeout: 10000,
  },
  resolve: {
    alias: {
      '@unisat/keyring-core': resolve(__dirname, './packages/keyring-core/src'),
      '@unisat/keyring-simple': resolve(__dirname, './packages/keyring-simple/src'),
      '@unisat/keyring-hd': resolve(__dirname, './packages/keyring-hd/src'),
      '@unisat/keyring-cold': resolve(__dirname, './packages/keyring-cold/src'),
      '@unisat/keyring-keystone': resolve(__dirname, './packages/keyring-keystone/src'),
    },
  },
})