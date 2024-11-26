import type { HttpResponse } from '../contracts'

import { errorMapper } from './error-mapper'
import { badRequest } from './httpHelper'

import type { UseCaseError } from '@/domain'

export const mapErrorsByCode = (error: UseCaseError): HttpResponse => {
  const errorResponse = errorMapper[error.code]

  if (!errorResponse) {
    return badRequest(error)
  }

  return errorResponse(error)
}
