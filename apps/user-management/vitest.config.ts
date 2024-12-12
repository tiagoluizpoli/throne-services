import path from 'node:path';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ['dotenv/config'],
  },
  plugins: [tsconfigPaths()],

  resolve: {
    alias: {
      '@prisma/shared-database/client': path.resolve(
        __dirname,
        '../../packages/shared-database/node_modules/@prisma/shared-database/client/index.js',
      ),
    },
  },
});
