import { relations, sql } from 'drizzle-orm'
import { foreignKey, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'

export const session = pgTable(
  'session',
  {
    id: text('id').notNull().primaryKey().default(sql`gen_random_uuid()`),
    tokenIdentifier: text('tokenIdentifier').notNull(),
    refreshTokenIdentifier: text('refreshTokenIdentifier').notNull(),
    tenantId: text('tenantId').notNull(),
    userId: text('userId').notNull(),
    createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
  },
  (session) => ({
    session_tenant_fkey: foreignKey({
      name: 'session_tenant_fkey',
      columns: [session.tenantId],
      foreignColumns: [tenant.id],
    })
      .onDelete('cascade')
      .onUpdate('cascade'),
    session_user_fkey: foreignKey({
      name: 'session_user_fkey',
      columns: [session.userId],
      foreignColumns: [user.id],
    })
      .onDelete('cascade')
      .onUpdate('cascade'),
  }),
)

export const session_challenge = pgTable(
  'session_challenge',
  {
    id: text('id').notNull().primaryKey().default(sql`gen_random_uuid()`),
    sessionIdentifier: text('sessionIdentifier').notNull(),
    tenantId: text('tenantId').notNull(),
    userId: text('userId').notNull(),
    createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
  },
  (session_challenge) => ({
    session_challenge_tenant_fkey: foreignKey({
      name: 'session_challenge_tenant_fkey',
      columns: [session_challenge.tenantId],
      foreignColumns: [tenant.id],
    })
      .onDelete('cascade')
      .onUpdate('cascade'),
    session_challenge_user_fkey: foreignKey({
      name: 'session_challenge_user_fkey',
      columns: [session_challenge.userId],
      foreignColumns: [user.id],
    })
      .onDelete('cascade')
      .onUpdate('cascade'),
  }),
)

export const tenant = pgTable('tenant', {
  id: text('id').notNull().primaryKey().default(sql`gen_random_uuid()`),
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  apikey: text('apikey').notNull(),
  availableUntil: timestamp('availableUntil', { precision: 3 }),
  createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
})

export const user = pgTable('user', {
  id: text('id').notNull().primaryKey().default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
})

export const tenant_user = pgTable(
  'tenant_user',
  {
    id: text('id').notNull().primaryKey().default(sql`gen_random_uuid()`),
    tenantId: text('tenantId').notNull(),
    userId: text('userId').notNull(),
    createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
  },
  (tenant_user) => ({
    tenant_user_tenant_fkey: foreignKey({
      name: 'tenant_user_tenant_fkey',
      columns: [tenant_user.tenantId],
      foreignColumns: [tenant.id],
    })
      .onDelete('cascade')
      .onUpdate('cascade'),
    tenant_user_user_fkey: foreignKey({
      name: 'tenant_user_user_fkey',
      columns: [tenant_user.userId],
      foreignColumns: [user.id],
    })
      .onDelete('cascade')
      .onUpdate('cascade'),
    tenant_user_tenantId_userId_unique_idx: uniqueIndex('tenant_user_tenantId_userId_key').on(
      tenant_user.tenantId,
      tenant_user.userId,
    ),
  }),
)

export const sessionRelations = relations(session, ({ one }) => ({
  tenant: one(tenant, {
    relationName: 'sessionTotenant',
    fields: [session.tenantId],
    references: [tenant.id],
  }),
  user: one(user, {
    relationName: 'sessionTouser',
    fields: [session.userId],
    references: [user.id],
  }),
}))

export const session_challengeRelations = relations(session_challenge, ({ one }) => ({
  tenant: one(tenant, {
    relationName: 'session_challengeTotenant',
    fields: [session_challenge.tenantId],
    references: [tenant.id],
  }),
  user: one(user, {
    relationName: 'session_challengeTouser',
    fields: [session_challenge.userId],
    references: [user.id],
  }),
}))

export const tenantRelations = relations(tenant, ({ many }) => ({
  tenantUser: many(tenant_user, {
    relationName: 'tenantTotenant_user',
  }),
  session: many(session, {
    relationName: 'sessionTotenant',
  }),
  session_challenge: many(session_challenge, {
    relationName: 'session_challengeTotenant',
  }),
}))

export const userRelations = relations(user, ({ many }) => ({
  tenantUser: many(tenant_user, {
    relationName: 'tenant_userTouser',
  }),
  session: many(session, {
    relationName: 'sessionTouser',
  }),
  session_challenge: many(session_challenge, {
    relationName: 'session_challengeTouser',
  }),
}))

export const tenant_userRelations = relations(tenant_user, ({ one }) => ({
  tenant: one(tenant, {
    relationName: 'tenantTotenant_user',
    fields: [tenant_user.tenantId],
    references: [tenant.id],
  }),
  user: one(user, {
    relationName: 'tenant_userTouser',
    fields: [tenant_user.userId],
    references: [user.id],
  }),
}))
