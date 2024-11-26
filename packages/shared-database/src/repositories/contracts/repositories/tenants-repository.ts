import type { Tenant } from '../../../entities'

export interface GetByCodeTenantsRepositoryParams {
  code: string
}

export interface TenantsRepository {
  getByCode: (params: GetByCodeTenantsRepositoryParams) => Promise<Tenant | undefined>
}
