import type { IntegrationRepository, IntegrationRepositoryGetByIdParams } from '@/application'
import type { Integration } from '@/domain'
import { db } from '@/main/clients'
import { and, eq, sql } from 'drizzle-orm'
import { integrationTable, tenantTable } from 'drizzle/schemas'
import { injectable } from 'tsyringe'
import { IntegrationMapper } from './mappers'

@injectable()
export class DrizzleIntegrationRepository implements IntegrationRepository {
  create = async (integration: Integration): Promise<void> => {
    const tenantId = sql`(${db.select({ id: tenantTable.id }).from(tenantTable).where(eq(tenantTable.code, integration.tenantCode))})`

    await db.insert(integrationTable).values({
      id: integration.id,
      tenantId,
      name: integration.name,
      code: integration.code,
      description: integration.description,
      uniqueCode: integration.uniqueCode,
      sourceMethod: integration.sourceMethod,
      targetMethod: integration.targetMethod,
      targetUrl: integration.targetUrl,
      createdAt: integration.createdAt,
    })
  }

  update = async (integration: Integration): Promise<void> => {
    const tenantId = sql`(${db.select({ id: tenantTable.id }).from(tenantTable).where(eq(tenantTable.code, integration.tenantCode))})`

    await db
      .update(integrationTable)
      .set({
        name: integration.name,
        code: integration.code,
        description: integration.description,
        sourceMethod: integration.sourceMethod,
        targetMethod: integration.targetMethod,
        targetUrl: integration.targetUrl,
      })
      .where(and(eq(integrationTable.id, integration.id), eq(integrationTable.tenantId, tenantId)))
  }

  getById = async (params: IntegrationRepositoryGetByIdParams): Promise<Integration | undefined> => {
    const result = await db
      .select()
      .from(integrationTable)
      .leftJoin(tenantTable, eq(tenantTable.id, integrationTable.tenantId))
      .where(
        and(
          eq(integrationTable.id, params.id),
          eq(
            integrationTable.tenantId,
            sql`(${db.select({ id: tenantTable.id }).from(tenantTable).where(eq(tenantTable.code, params.tenantCode))})`,
          ),
        ),
      )
      .limit(1)
      .execute()

    return IntegrationMapper.toDomain(result)
  }
}
