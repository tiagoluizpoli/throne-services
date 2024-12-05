import type { UseCaseError } from '@/domain/core'
import { serverError } from '@solutions/core/api'

export const errorMapper: Record<string, any> = {
  UNEXPECTED_ERROR: (error: UseCaseError) => serverError(error),
}
