import { integer, jsonb, pgEnum, pgTable, text, timestamp, unique, uuid, varchar } from 'drizzle-orm/pg-core';

export const tenantTable = pgTable('tenant', {
  id: uuid('id').notNull().primaryKey().defaultRandom(),
  name: varchar('name', {
    length: 60,
  }).notNull(),
  code: varchar('code', {
    length: 40,
  }).notNull(),
  description: varchar('description'),
  createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
});

export const MethodEnum = pgEnum('Method', ['GET', 'POST', 'PUT', 'DELETE']);

export const integrationTable = pgTable(
  'integration',
  {
    id: uuid('id').notNull().primaryKey().defaultRandom(),
    tenantId: uuid('tenantId')
      .references(() => tenantTable.id)
      .notNull(),
    code: varchar('code', { length: 128 }).notNull(),
    name: varchar('name', { length: 128 }).notNull(),
    uniqueCode: varchar('uniqueCode', { length: 256 }),
    sourceMethod: MethodEnum('sourceMethod').default('GET').notNull(),
    targetMethod: MethodEnum('targetMethod').default('GET').notNull(),
    targetUrl: varchar('targetUrl', { length: 256 }).notNull(),
    description: text('description'),
    createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
    deletedAt: timestamp('deletedAt', { precision: 3 }),
  },
  (table) => [
    unique('unique_integrationCode_tenantCode_sourceMethod_targetMethod_targetUrl').on(table.tenantId, table.code),
  ],
);

export const schemaTable = pgTable('schema', {
  id: uuid('id').notNull().primaryKey().defaultRandom(),
  integrationId: uuid('integrationId')
    .references(() => integrationTable.id)
    .notNull(),
  code: varchar('code', { length: 128 }).notNull(),
  name: varchar('name', { length: 128 }).notNull(),
  schema: jsonb('schema').notNull(),
  createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
});

export const mappingTypeEnum = pgEnum('MappingType', ['input', 'output']);

export const mappingTable = pgTable(
  'mapping',
  {
    id: uuid('id').notNull().primaryKey().defaultRandom(),
    integrationId: uuid('integrationId')
      .references(() => integrationTable.id)
      .notNull(),
    type: mappingTypeEnum('type').notNull(),
    sourceSchemaId: uuid('sourceSchemaId')
      .references(() => schemaTable.id)
      .notNull(),
    targetSchemaId: uuid('targetSchemaId')
      .references(() => schemaTable.id)
      .notNull(),
    mappedSchema: jsonb('mappedSchema').notNull(),
    createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
  },
  (table) => [unique('unique_integrationId_type').on(table.integrationId, table.type)],
);

export const executionStatusEnum = pgEnum('ExecutionStatus', ['processing', 'success', 'failed']);

export const executionTable = pgTable('execution', {
  id: uuid('id').notNull().primaryKey().defaultRandom(),
  integrationId: uuid('integrationId')
    .references(() => integrationTable.id)
    .notNull(),
  executedAt: timestamp('executedAt', { precision: 3 }).notNull().defaultNow(),
  duration: integer('duration').notNull(),
  status: executionStatusEnum('status').default('processing').notNull(),
  error: jsonb('error'),
});
