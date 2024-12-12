import path from 'node:path';
import { defineConfig } from 'vitest/config';

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  test: {
    globals: true,
    setupFiles: ['dotenv/config'],
  },
  resolve: {
    alias: {
      '@prisma/shared-database/client': path.resolve(__dirname, 'node_modules/@prisma/shared-database/client/index.js'),
    },
  },
});
