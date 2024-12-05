import type { GetByFieldRepositoryParams } from '@solutions/core/application'

import { and, eq } from 'drizzle-orm'
import { tenant, tenant_user, user } from '../../../drizzle/schemas/schema'
import { db } from '../../client/drizzle'

import type { User } from '../../entities'
import type { UsersRepository } from '../contracts'
import { UserMapper } from './mappers'

export class DrizzleUsersRepository implements UsersRepository {
  getByEmail = async (email: string): Promise<User | undefined> => {
    const rows = await db
      .select()
      .from(user)
      .leftJoin(tenant_user, eq(user.id, tenant_user.userId))
      .leftJoin(tenant, eq(tenant_user.tenantId, tenant.id))
      .where(eq(user.email, email))
      .execute()

    return UserMapper.toDomain(rows)
  }
  getByField = async ({ tenantCode, field, value }: GetByFieldRepositoryParams): Promise<User | undefined> => {
    const rows = await db
      .select()
      .from(user)
      .leftJoin(tenant_user, eq(user.id, tenant_user.userId))
      .leftJoin(tenant, eq(tenant_user.tenantId, tenant.id))
      .where(and(eq(tenant.code, tenantCode), this.dynamicQuery(field, value)))
      .execute()

    return UserMapper.toDomain(rows)
  }

  private dynamicQuery(field: string, value: string) {
    const eqMapper: Record<string, any> = {
      id: eq(user.id, value),
      name: eq(user.name, value),
      email: eq(user.email, value),
    }

    return eqMapper[field]
  }
}
