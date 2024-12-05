import { type NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres'
import type { schema } from '../../../drizzle/schemas'
import { env } from '../../config'

const { database } = env

export const db: NodePgDatabase<typeof schema> = drizzle({
  connection: database.url,
  casing: 'snake_case',
})
