import { badRequest, baseErrorMapper, tooManyRequests, unauthorized } from '@solutions/core/api'
import type { UseCaseError } from '@solutions/core/domain'

export const errorMapper: Record<string, any> = {
  ...baseErrorMapper,
  CODE_MISMATCH_ERROR: (error: UseCaseError) => badRequest(error),
  EXPIRED_CODE_ERROR: (error: UseCaseError) => badRequest(error),
  USER_HAS_MULTIPLE_TENANTS_ERROR: (error: UseCaseError) => badRequest(error),
  FORBIDDEN_ERROR: (error: UseCaseError) => unauthorized(),
  NOT_AUTHORIZED_ERROR: (error: UseCaseError) => unauthorized(),
  INVALID_PASSWORD_ERROR: (error: UseCaseError) => badRequest(error),
  PASSWORD_RESET_REQUIRED_ERROR: (error: UseCaseError) => badRequest(error),
  TOO_MANY_REQUESTS_ERROR: (error: UseCaseError) => tooManyRequests(error),
  USER_NOT_CONFIRMED_ERROR: (error: UseCaseError) => unauthorized(),
  USER_NOT_FOUND_ERROR: (error: UseCaseError) => unauthorized(),
  CHALLENGE_SESSION_NOT_FOUND_ERROR: (error: UseCaseError) => unauthorized(),
  PREVIOUS_SESSION_NOT_FOUND_ERROR: (error: UseCaseError) => unauthorized(),
}
