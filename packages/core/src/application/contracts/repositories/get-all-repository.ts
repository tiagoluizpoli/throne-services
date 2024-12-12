import type { PaginationParams, PaginationResult, SearchParams, TenantParams } from './../../../domain/types';

export interface GetAllRepositoryParams<OrderBy = 'createdAt'>
  extends TenantParams,
    PaginationParams<OrderBy>,
    SearchParams {}

export interface GetAllRepositoryResult<T> extends PaginationResult<T> {}

export interface GetAllRepository<T, OrderBy = 'createdAt'> {
  getAll: (params: GetAllRepositoryParams<OrderBy>) => GetAllRepositoryResult<T>;
}
