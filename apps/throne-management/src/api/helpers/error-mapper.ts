import { serverError } from '@solutions/core/api'
import type { UseCaseError } from '@solutions/core/domain'

export const errorMapper: Record<string, any> = {
  UNEXPECTED_ERROR: (error: UseCaseError) => serverError(error),
}
