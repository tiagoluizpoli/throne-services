import type { UseCaseError } from '@solutions/core/domain'
import { serverError } from './http-helper'

export const baseErrorMapper: Record<string, any> = {
  UNEXPECTED_ERROR: (error: UseCaseError) => serverError(error),
}
