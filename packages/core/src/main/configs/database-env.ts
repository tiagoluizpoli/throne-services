import { z } from 'zod';

const databaseSchema = z.object({
  database: z.object({
    url: z.string().min(1),
  }),
});

type DatabaseEnv = z.infer<typeof databaseSchema>;

export const databaseEnv = (): DatabaseEnv => {
  const dbEnvData: DatabaseEnv = {
    database: {
      url: process.env.DATABASE_URL ?? '',
    },
  };

  const result = databaseSchema.safeParse(dbEnvData);

  if (!result.success) {
    throw new Error('Invalid database connection env');
  }

  return result.data;
};
