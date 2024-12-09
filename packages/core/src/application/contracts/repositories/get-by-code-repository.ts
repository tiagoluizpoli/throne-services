import type { TenantParams } from '../../../domain'

export interface GetByCodeRepositoryParams extends TenantParams {
  code: string
}

export interface GetByCodeRepository<T> {
  getByCode: (params: GetByCodeRepositoryParams) => Promise<T | undefined>
}
