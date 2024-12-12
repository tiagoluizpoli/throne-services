import type {
  IntegrationRepository,
  IntegrationRepositoryDeleteParams,
  IntegrationRepositoryGetAllParams,
  IntegrationRepositoryGetAllResult,
  IntegrationRepositoryGetByIdParams,
} from '@/application';
import type { Integration } from '@/domain';
import { db } from '@/main/clients';
import { and, asc, desc, eq, isNull, like, or, sql } from 'drizzle-orm';
import { integrationTable, tenantTable } from 'drizzle/schemas';
import { injectable } from 'tsyringe';
import { IntegrationMapper } from './mappers';

@injectable()
export class DrizzleIntegrationRepository implements IntegrationRepository {
  create = async (integration: Integration): Promise<void> => {
    const tenantId = sql`(${db.select({ id: tenantTable.id }).from(tenantTable).where(eq(tenantTable.code, integration.tenantCode)).getSQL()})`;

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
    });
  };

  update = async (integration: Integration): Promise<void> => {
    const tenantId = sql`(${db.select({ id: tenantTable.id }).from(tenantTable).where(eq(tenantTable.code, integration.tenantCode)).getSQL()})`;

    const result = await db
      .update(integrationTable)
      .set({
        name: integration.name,
        code: integration.code,
        description: integration.description,
        sourceMethod: integration.sourceMethod,
        targetMethod: integration.targetMethod,
        targetUrl: integration.targetUrl,
      })
      .where(
        and(
          eq(integrationTable.id, integration.id),
          eq(integrationTable.tenantId, tenantId),
          isNull(integrationTable.deletedAt),
        ),
      )
      .execute();

    console.log(result);
  };

  delete = async (params: IntegrationRepositoryDeleteParams): Promise<void> => {
    const { id, tenantCode } = params;
    const tenantId = sql`(${db.select({ id: tenantTable.id }).from(tenantTable).where(eq(tenantTable.code, tenantCode)).getSQL()})`;

    await db
      .update(integrationTable)
      .set({ deletedAt: new Date() })
      .where(
        and(eq(integrationTable.id, id), eq(integrationTable.tenantId, tenantId), isNull(integrationTable.deletedAt)),
      )
      .execute();
  };

  getAll = async (params: IntegrationRepositoryGetAllParams): Promise<IntegrationRepositoryGetAllResult> => {
    const { tenantCode, search, pageIndex, pageSize, orderBy, orderDirection } = params;

    const tenantId = sql`(${db.select({ id: tenantTable.id }).from(tenantTable).where(eq(tenantTable.code, tenantCode)).getSQL()})`;
    const where = and(
      isNull(integrationTable.deletedAt),
      eq(integrationTable.tenantId, tenantId),
      search
        ? or(
            like(sql`lower(${integrationTable.name})`, `%${search?.toLowerCase()}%`),
            like(sql`lower(${integrationTable.code})`, `%${search?.toLowerCase()}%`),
          )
        : undefined,
    );
    const count = await db
      .select()
      .from(integrationTable)
      .leftJoin(tenantTable, eq(tenantTable.id, integrationTable.tenantId))
      .where(where)
      .execute();

    const integrationPersistence = await db
      .select()
      .from(integrationTable)
      .leftJoin(tenantTable, eq(tenantTable.id, integrationTable.tenantId))
      .where(where)
      .limit(pageSize)
      .offset(pageIndex * pageSize)
      .orderBy(orderDirection === 'asc' ? asc(integrationTable[orderBy]) : desc(integrationTable[orderBy]))
      .execute();

    const result: IntegrationRepositoryGetAllResult = {
      total: count.length,
      integrations: IntegrationMapper.toDomainList(integrationPersistence),
    };

    return result;
  };

  getById = async (params: IntegrationRepositoryGetByIdParams): Promise<Integration | undefined> => {
    const result = await db
      .select()
      .from(integrationTable)
      .leftJoin(tenantTable, eq(tenantTable.id, integrationTable.tenantId))
      .where(
        and(
          isNull(integrationTable.deletedAt),
          eq(integrationTable.id, params.id),
          eq(
            integrationTable.tenantId,
            sql`(${db.select({ id: tenantTable.id }).from(tenantTable).where(eq(tenantTable.code, params.tenantCode))})`,
          ),
        ),
      )
      .limit(1)
      .execute();

    return IntegrationMapper.toDomain(result);
  };
}
