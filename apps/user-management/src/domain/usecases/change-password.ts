import type { Either, UnexpectedError } from '@solutions/core/domain'
import type {
  ForbiddenError,
  InvalidPasswordError,
  NotAuthorizedError,
  PasswordPreviouslyUsedError,
  PasswordResetRequiredError,
  TooManyRequestsError,
  UserNotConfirmedError,
  UserNotFoundError,
} from './errors'

export interface ChangePasswordParams {
  previousPassword: string
  newPassword: string
  accessToken: string
}

export type ChangePasswordError =
  | ForbiddenError
  | NotAuthorizedError
  | PasswordPreviouslyUsedError
  | InvalidPasswordError
  | PasswordResetRequiredError
  | TooManyRequestsError
  | UserNotConfirmedError
  | UserNotFoundError
  | UnexpectedError

export type ChangePassword = {
  execute: (params: ChangePasswordParams) => Promise<Either<ChangePasswordError, void>>
}
