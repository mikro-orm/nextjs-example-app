import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, '.'),
    },
  },
  test: {
    environment: 'node',
    include: ['__tests__/**/*.spec.ts'],
    globals: true,
    coverage: {
      reporter: ['clover', 'json', 'lcov', 'text'],
      include: ['lib/**/*.ts'],
    },
    disableConsoleIntercept: true,
    clearMocks: true,
    fileParallelism: false,
    testTimeout: 60_000,
  },
});
