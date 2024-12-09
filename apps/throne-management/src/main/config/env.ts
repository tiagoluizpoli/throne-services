import { config } from 'dotenv'
import { z } from 'zod'

config({ override: true })

const envSchema = z.object({
  baseConfig: z.object({
    environment: z.string(),
    logLevel: z.string(),
    port: z.number(),
  }),
  database: z.object({
    url: z.string(),
  }),
})

type Env = z.infer<typeof envSchema>
export const envData: Env = {
  baseConfig: {
    environment: process.env.NODE_ENV ?? '',
    logLevel: process.env.LOG_LEVEL ?? '',
    port: Number(process.env.PORT) ?? 8001,
  },
  database: {
    url: process.env.DATABASE_URL ?? '',
  },
} as const

export const env = envSchema.parse(envData)
