export const serverEnv = () =>
  ({
    server: {
      port: process.env.PORT ?? '8010',
    },
  }) as const;
