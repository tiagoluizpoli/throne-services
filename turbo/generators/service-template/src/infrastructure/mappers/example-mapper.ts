import type { example, tenant } from '@prisma/.prisma/client';

import { Example } from '@/domain/entities';
import { TenantMapper } from '@/infrastructure/mappers/tenant-mapper';

type ExamplePersistence = example & {
  tenant: tenant | null;
};

export class ExampleMapper {
  static toDomain(raw: ExamplePersistence): Example {
    return Example.create(
      {
        tenantCode: raw.tenant?.code ?? undefined,
        tenant: raw.tenant ? TenantMapper.toDomain(raw.tenant) : undefined,
        code: raw.code,
        name: raw.name,
        description: raw.description ?? '',
        createdAt: raw.createdAt,
      },
      raw.id,
    );
  }
}
