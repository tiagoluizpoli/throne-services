import type { UseCaseError } from '../../domain/errors'
import type { HttpResponse } from '../contracts/http'
import { serverError } from './http-helper'

export const mapErrorsByCode = (error: UseCaseError, mapper: Record<string, any>): HttpResponse => {
  const errorResponse = mapper[error.code]

  if (!errorResponse) {
    return serverError(error)
  }

  return errorResponse(error)
}
