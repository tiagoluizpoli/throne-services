import type { Either, UnexpectedError } from '@solutions/core/domain'
import type { Method } from '../entities'
import type { IntegrationAlreadyExistsError, IntegrationNotFoundError } from '../errors'

export interface UpdateIntegrationParams {
  id: string
  tenantCode: string
  name: string
  code: string
  description: string
  sourceMethod: Method
  targetMethod: Method
  targetUrl: string
}

export type UpdateIntegrationPossibleErrors = IntegrationNotFoundError | IntegrationAlreadyExistsError | UnexpectedError

export interface UpdateIntegration {
  execute: (params: UpdateIntegrationParams) => Promise<Either<UpdateIntegrationPossibleErrors, void>>
}
