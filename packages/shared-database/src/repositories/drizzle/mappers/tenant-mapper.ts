import type { tenant } from '../../../../drizzle/schemas/schema'
import { Tenant } from '../../../entities'

type TenantPersistence = typeof tenant.$inferSelect

export class TenantMapper {
  static toDomain(raw: TenantPersistence): Tenant {
    const tenant = Tenant.create(
      {
        code: raw.code,
        name: raw.name,
        createdAt: raw.createdAt,
        apiKey: raw.apikey,
        availableUntil: raw.availableUntil ?? undefined,
        description: raw.description ?? undefined,
      },
      raw.id,
    )

    return tenant
  }
}
