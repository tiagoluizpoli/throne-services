import type { UserNotFoundError } from '@/domain/usecases'
import type { Either, UnexpectedError } from '@solutions/core/domain'
import type { Tenant } from '@solutions/shared-database'

export interface GetUserTenantsWithAuthParams {
  username: string
  password: string
}

export type GetUserTenantsWithAuthError = UnexpectedError | UserNotFoundError

export interface GetUserTenantsWithAuth {
  execute: (params: GetUserTenantsWithAuthParams) => Promise<Either<GetUserTenantsWithAuthError, Tenant[]>>
}
