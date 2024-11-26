export const databaseEnv = () =>
  ({
    database: {
      host: process.env.PG_HOST,
      port: Number.parseInt(process.env.PG_PORT ?? '') || 5432,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
    },
  }) as const
