import type { TenantParams } from '../../../domain';

export interface GetByFieldRepositoryParams extends TenantParams {
  field: string;
  value: string;
}

export interface GetByFieldRepository<T> {
  getByField: (params: GetByFieldRepositoryParams) => Promise<T | undefined>;
}
