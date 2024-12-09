import type { UseCaseError } from '../../domain'
import { serverError } from './http-helper'

export const baseErrorMapper: Record<string, any> = {
  UNEXPECTED_ERROR: (error: UseCaseError) => serverError(error),
}
