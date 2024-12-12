import { User } from '../../../entities';
import { TenantMapper } from './tenant-mapper';

import type { tenant, tenant_user, user } from '../../../client';

type UserPersistence = user & {
  tenantUser: (tenant_user & {
    tenant: tenant;
  })[];
};

export class UserMapper {
  static toDomain(raw: UserPersistence): User {
    return User.create(
      {
        name: raw.name,
        email: raw.email,
        createdAt: raw.createdAt,
        tenants: raw.tenantUser.map((tu) => TenantMapper.toDomain(tu.tenant)),
      },
      raw.id,
    );
  }
}
