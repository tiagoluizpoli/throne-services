import type { UseCaseError } from '@solutions/core/domain'

export class ForbiddenError extends Error implements UseCaseError {
  constructor() {
    super('Forbidden')
    this.name = 'ForbiddenError'
    this.code = 'FORBIDDEN_ERROR'
  }

  code: string
}

export class NotAuthorizedError extends Error implements UseCaseError {
  constructor() {
    super('Not authorized')
    this.name = 'NotAuthorizedError'
    this.code = 'NOT_AUTHORIZED_ERROR'
  }

  code: string
}

export class PasswordPreviouslyUsedError extends Error implements UseCaseError {
  constructor() {
    super('Password previously used')
    this.name = 'PasswordPreviouslyUsedError'
    this.code = 'PASSWORD_PREVIOUSLY_USED_ERROR'
  }

  code: string
}

export class InvalidPasswordError extends Error implements UseCaseError {
  constructor() {
    super('Invalid password')
    this.name = 'InvalidPasswordError'
    this.code = 'INVALID_PASSWORD_ERROR'
  }

  code: string
}

export class PasswordResetRequiredError extends Error implements UseCaseError {
  constructor() {
    super('Reset password is required')
    this.name = 'PasswordResetRequiredError'
    this.code = 'PASSWORD_RESET_REQUIRED_ERROR'
  }

  code: string
}

export class TooManyRequestsError extends Error implements UseCaseError {
  constructor() {
    super('Too many requests')
    this.name = 'TooManyRequestsError'
    this.code = 'TOO_MANY_REQUESTS_ERROR'
  }

  code: string
}

export class UserNotConfirmedError extends Error implements UseCaseError {
  constructor() {
    super('User not confirmed')
    this.name = 'UserNotConfirmedError'
    this.code = 'USER_NOT_CONFIRMED_ERROR'
  }

  code: string
}

export class UserNotFoundError extends Error implements UseCaseError {
  constructor() {
    super('User not found')
    this.name = 'UserNotFoundError'
    this.code = 'USER_NOT_FOUND_ERROR'
  }

  code: string
}

export class CodeMismatchError extends Error implements UseCaseError {
  constructor() {
    super('Code mismatch')
    this.name = 'CodeMismatchError'
    this.code = 'CODE_MISMATCH_ERROR'
  }

  code: string
}

export class ExpiredCodeError extends Error implements UseCaseError {
  constructor() {
    super('Expired code')
    this.name = 'ExpiredCodeError'
    this.code = 'EXPIRED_CODE_ERROR'
  }

  code: string
}

export class CodeDeliveryFailureError extends Error implements UseCaseError {
  constructor() {
    super('Code delivery failure')
    this.name = 'CodeDeliveryFailureError'
    this.code = 'CODE_DELIVERY_FAILURE_ERROR'
  }

  code: string
}

export class ChallengeSessionNotFoundError extends Error implements UseCaseError {
  constructor() {
    super('Challenge session not found')
    this.name = 'ChallengeSessionNotFoundError'
    this.code = 'CHALLENGE_SESSION_NOT_FOUND_ERROR'
  }

  code: string
}

export class UserHasMultipleTenantsError extends Error implements UseCaseError {
  constructor() {
    super('User has multiple tenants, please provide tenant code')
    this.name = 'UserHasMultipleTenantsError'
    this.code = 'USER_HAS_MULTIPLE_TENANTS_ERROR'
  }

  code: string
}

export class PreviousSessionNotFoundError extends Error implements UseCaseError {
  constructor() {
    super('Previous session not found')
    this.name = 'PreviousSessionNotFoundError'
    this.code = 'PREVIOUS_SESSION_NOT_FOUND_ERROR'
  }

  code: string
}
