export const commonEnv = () =>
  ({
    common: {
      environment: process.env.ENVIRONMENT ?? 'local',
      logLevel: process.env.LOG_LEVEL ?? 'prod',
    },
  }) as const;
