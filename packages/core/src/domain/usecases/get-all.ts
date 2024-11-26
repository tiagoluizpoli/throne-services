import type { UnexpectedError } from '../errors'
import type { Either } from '../logic'
import type { PaginationParams, SearchParams, TenantParams } from '../types'

export interface GetAllParams extends TenantParams, PaginationParams, SearchParams {}

export interface GetAllResult<R> {
  total: number
  items: R[]
}

export type GetAllErrors = UnexpectedError

export interface GetAll<R> {
  execute: (params: GetAllParams) => Promise<Either<GetAllErrors, GetAllResult<R>>>
}
