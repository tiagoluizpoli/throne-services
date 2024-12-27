import { Integration } from '@/domain';
import type { integrationTable, mappingTable, schemaTable, tenantTable } from 'drizzle/schemas';
import { MappingMapper } from './mapping-mapper';

type IntegrationListPersistence = {
  integration: typeof integrationTable.$inferSelect;
  tenant: typeof tenantTable.$inferSelect | null;
  mapping?: typeof mappingTable.$inferSelect | null;
};

type IntegrationPersistence = typeof integrationTable.$inferSelect & {
  tenant: typeof tenantTable.$inferSelect;
  mapping?: (typeof mappingTable.$inferSelect & {
    sourceSchema: typeof schemaTable.$inferSelect;
    targetSchema: typeof schemaTable.$inferSelect;
  })[];
};

type IntegrationCleanPersistence = typeof integrationTable.$inferSelect & {
  tenant: typeof tenantTable.$inferSelect;
};

export class IntegrationMapper {
  static toDomain = (raw: IntegrationPersistence | undefined): any => {
    console.log(JSON.stringify(raw, null, 2));

    if (!raw || !raw.tenant) {
      return undefined;
    }
    const integration = raw;

    return Integration.create(
      {
        code: integration.code,
        name: integration.name,
        uniqueCode: integration.uniqueCode ?? undefined,
        description: integration.description ?? undefined,
        sourceMethod: integration.sourceMethod,
        targetMethod: integration.targetMethod,
        targetUrl: integration.targetUrl,
        mappings: integration.mapping?.map((m) => MappingMapper.toDomain(m)),
        createdAt: integration.createdAt,
        tenantCode: integration.tenant.code,
      },
      integration.id,
    );
  };

  static toDomainClean = (raw: IntegrationCleanPersistence): Integration => {
    return Integration.create(
      {
        code: raw.code,
        name: raw.name,
        uniqueCode: raw.uniqueCode ?? undefined,
        description: raw.description ?? undefined,
        sourceMethod: raw.sourceMethod,
        targetMethod: raw.targetMethod,
        targetUrl: raw.targetUrl,
        createdAt: raw.createdAt,
        tenantCode: raw.tenant.code,
      },
      raw.id,
    );
  };

  static toDomainList = (raw: IntegrationListPersistence[]): Integration[] => {
    if (raw.length === 0 || !raw[0].tenant || !raw[0].integration) {
      return [];
    }

    console.log(raw);

    return raw.map((item) => {
      const { integration, tenant } = item;
      return Integration.create(
        {
          code: integration.code,
          name: integration.name,
          uniqueCode: integration.uniqueCode ?? undefined,
          description: integration.description ?? undefined,
          sourceMethod: integration.sourceMethod,
          targetMethod: integration.targetMethod,
          targetUrl: integration.targetUrl,
          createdAt: integration.createdAt,
          tenantCode: tenant!.code,
        },
        integration.id,
      );
    });
  };
}
