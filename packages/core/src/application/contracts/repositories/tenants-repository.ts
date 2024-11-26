import type { Tenant } from '../../../domain'
import type { SaveRepository } from './save-repository'

export interface GetByCodeTenantsRepositoryParams {
  code: string
}

export interface TenantsRepository extends SaveRepository<Tenant> {
  getByCode: (params: GetByCodeTenantsRepositoryParams) => Promise<Tenant | undefined>
}
