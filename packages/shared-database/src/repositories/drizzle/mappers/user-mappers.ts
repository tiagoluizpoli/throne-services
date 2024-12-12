import type { InferSelectModel } from 'drizzle-orm';
import type { tenant, tenant_user, user } from '../../../../drizzle/schemas/schema';
import { User } from '../../../entities';
import { TenantMapper } from './tenant-mapper';

interface UserPersistence {
  user: InferSelectModel<typeof user>;
  tenant: InferSelectModel<typeof tenant> | null;
  tenant_user: InferSelectModel<typeof tenant_user> | null;
}

export class UserMapper {
  static toDomain(rows: UserPersistence[]): User {
    const { user: userPersistence } = rows[0];

    const result = User.create(
      {
        name: userPersistence.name,
        email: userPersistence.email,
        createdAt: userPersistence.createdAt,
        tenants: rows.map((t) => TenantMapper.toDomain(t.tenant!)),
      },
      userPersistence.id,
    );

    return result;
  }
}
