import type { tenant } from '@prisma/.prisma/client';

import { Tenant } from '@/domain/entities';

type TenantPersistence = tenant;

export class TenantMapper {
  static toDomain(raw: TenantPersistence): Tenant {
    return Tenant.create(
      {
        code: raw.code,
      },
      raw.id,
    );
  }
}
