import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/firestore/**/*.spec.ts'],
    environment: 'node',
    fileParallelism: false,
    testTimeout: 10_000,
    hookTimeout: 10_000,
  },
});
