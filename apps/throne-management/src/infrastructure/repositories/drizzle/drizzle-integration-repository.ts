import type { IntegrationRepository } from '@/application'
import type { Integration } from '@/domain'
import { db } from '@/main/clients'
import { eq, sql } from 'drizzle-orm'
import { integrationTable, tenantTable } from 'drizzle/schemas'

export class DrizzleIntegrationRepository implements IntegrationRepository {
  create = async (integration: Integration): Promise<void> => {
    const tenantId = sql`(${db.select({ id: tenantTable.id }).from(tenantTable).where(eq(tenantTable.code, integration.code))})`

    await db.insert(integrationTable).values({
      id: integration.id,
      tenantId,
      name: integration.name,
      code: integration.code,
      description: integration.description,
      sourceMethod: integration.sourceMethod,
      targetMethod: integration.targetMethod,
      targetUrl: integration.targetUrl,
      createdAt: integration.createdAt,
    })
  }
}
