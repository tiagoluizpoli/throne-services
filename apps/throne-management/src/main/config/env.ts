import { config } from 'dotenv'

config({ override: true })

export const env = {
  baseConfig: {
    environment: process.env.ENVIRONMENT ?? 'local',
    logLevel: process.env.LOG_LEVEL ?? 'prod',
    port: process.env.PORT ?? 8001,
  },
  database: {
    host: process.env.PG_HOST,
    port: Number.parseInt(process.env.PG_PORT ?? '') || 5432,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
  },
} as const
