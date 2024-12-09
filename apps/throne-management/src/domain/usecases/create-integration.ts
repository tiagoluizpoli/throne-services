import type { UnexpectedError } from '@solutions/core/domain'
import type { IntegrationAlreadyExistsError } from '../errors'

export type CreateIntegrationParams = {
  name: string
  code: string
  description: string
  sourceMethod: string
  targetMethod: string
  targetUrl: string
}

export type CreateIntegrationPossibleErrors = IntegrationAlreadyExistsError | UnexpectedError

export interface CreateIntegration {
  execute: (params: CreateIntegrationParams) => Promise<void>
}
