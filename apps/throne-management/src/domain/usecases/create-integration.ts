import type { Either, UnexpectedError } from '@solutions/core/domain'
import type { Method } from '../entities'
import type { IntegrationAlreadyExistsError } from '../errors'

export type CreateIntegrationParams = {
  tenantCode: string
  name: string
  code: string
  description?: string
  sourceMethod: Method
  targetMethod: Method
  targetUrl: string
}

export type CreateIntegrationPossibleErrors = IntegrationAlreadyExistsError | UnexpectedError

export interface CreateIntegration {
  execute: (params: CreateIntegrationParams) => Promise<Either<CreateIntegrationPossibleErrors, void>>
}
