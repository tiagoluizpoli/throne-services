import { awsEnv, cognitoEnv, commonEnv, serverEnv } from '@solutions/core/main';
import { config } from 'dotenv';

config({ override: true });

export const env = {
  logger: {
    level: process.env.LOGGER_LEVEL ?? 'info',
  },

  ...commonEnv(),
  ...serverEnv(),
  ...awsEnv(),
  ...cognitoEnv(),
} as const;
