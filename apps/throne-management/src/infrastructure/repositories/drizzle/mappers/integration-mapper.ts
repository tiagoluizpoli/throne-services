import { Integration } from '@/domain';
import type { integrationTable, tenantTable } from 'drizzle/schemas';

type IntegrationPersistence = {
  integration: typeof integrationTable.$inferSelect;
  tenant: typeof tenantTable.$inferSelect | null;
};

export class IntegrationMapper {
  static toDomain = (raw: IntegrationPersistence[]): any => {
    if (raw.length === 0 || !raw[0].tenant || !raw[0].integration) {
      return undefined;
    }

    const { integration, tenant } = raw[0];
    // if (!tenant || !integration) {
    //   return undefined;
    // }

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
