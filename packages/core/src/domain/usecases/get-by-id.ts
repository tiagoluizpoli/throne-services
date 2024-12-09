import type { UnexpectedError } from '../errors'
import type { Either } from '../logic'
import type { TenantParams } from '../types'

export interface GetByIdParams extends TenantParams {
  id: string
}

export type GetByIdResult<R> = R

export type GetByIdErrors<E> = UnexpectedError | E

export interface GetById<R, E extends Error> {
  execute: (params: GetByIdParams) => Promise<Either<E, GetByIdResult<R>>>
}
