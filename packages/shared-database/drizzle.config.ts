import fs from 'node:fs'
import dotenv from 'dotenv'
import { defineConfig } from 'drizzle-kit'

const envFile = '.env'

if (!fs.existsSync(envFile)) {
  throw new Error('.env file not found')
}

dotenv.config({ path: envFile })

export default defineConfig({
  schema: './drizzle/schemas/schema.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
  },
})
