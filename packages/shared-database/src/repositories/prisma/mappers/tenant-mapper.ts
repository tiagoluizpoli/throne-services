import type { tenant } from '../../../client';

import { Tenant } from '../../../entities';

type TenantPersistence = tenant;

export class TenantMapper {
  static toDomain(raw: TenantPersistence): Tenant {
    return Tenant.create(
      {
        code: raw.code,
        name: raw.name,
        description: raw.description ?? undefined,
        availableUntil: raw.availableUntil ?? undefined,
        apiKey: raw.apikey,
        createdAt: raw.createdAt,
      },
      raw.id,
    );
  }
}
