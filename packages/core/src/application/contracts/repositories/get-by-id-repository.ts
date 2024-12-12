import type { TenantParams } from '../../../domain';

export interface GetByIdRepositoryParams extends TenantParams {
  id: string;
}

export interface GetByIdRepository<R> {
  getById: (params: GetByIdRepositoryParams) => Promise<R | undefined>;
}
