import { databaseEnv } from '@solutions/core/main';
import { config } from 'dotenv';

config({ override: true });

export const env = {
  logger: {
    level: process.env.LOGGER_LEVEL ?? 'info',
  },
  ...databaseEnv(),
} as const;
