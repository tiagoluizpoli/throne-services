import { injectable } from 'tsyringe'
import { prisma } from '../../client'
import type { Tenant } from '../../entities'
import type { GetByCodeTenantsRepositoryParams, TenantsRepository } from '../contracts'
import { TenantMapper } from './mappers'

@injectable()
export class PrismaTenantsRepository implements TenantsRepository {
  async getByCode({ code }: GetByCodeTenantsRepositoryParams): Promise<Tenant | undefined> {
    const tenantPersistence = await prisma.tenant.findFirst({
      where: {
        code,
      },
    })

    if (!tenantPersistence) {
      return undefined
    }

    return TenantMapper.toDomain(tenantPersistence)
  }
}
