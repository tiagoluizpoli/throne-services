import { Integration } from '@/domain';
import type { integrationTable, tenantTable } from 'drizzle/schemas';

type IntegrationPersistence = {
  integration: typeof integrationTable.$inferSelect;
  tenant: typeof tenantTable.$inferSelect | null;
};

export class IntegrationMapper {
  static toDomain = (raw: IntegrationPersistence[]): any => {
    const persistence = raw[0];
    const { integration, tenant } = persistence;
    if (!tenant || !integration) {
      return undefined;
    }

    return Integration.create(
      {
        code: integration.code,
        name: integration.name,
        description: integration.description ?? undefined,
        sourceMethod: integration.sourceMethod,
        targetMethod: integration.targetMethod,
        targetUrl: integration.targetUrl,
        createdAt: integration.createdAt,
        tenantCode: tenant.code,
      },
      integration.id,
    );
  };
}
