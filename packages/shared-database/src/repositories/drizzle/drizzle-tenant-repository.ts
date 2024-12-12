import { eq } from 'drizzle-orm';
import { tenant } from '../../../drizzle/schemas/schema';
import { db } from '../../client/drizzle';
import type { Tenant } from '../../entities';
import type { GetByCodeTenantsRepositoryParams, TenantsRepository } from '../contracts';
import { TenantMapper } from './mappers';

export class DrizzleTenantRepository implements TenantsRepository {
  getByCode = async ({ code }: GetByCodeTenantsRepositoryParams): Promise<Tenant | undefined> => {
    const result = await db.select().from(tenant).where(eq(tenant.code, code));

    return TenantMapper.toDomain(result[0]);
  };
}
