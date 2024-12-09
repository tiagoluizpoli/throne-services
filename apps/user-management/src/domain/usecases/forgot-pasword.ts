import type { Either, UnexpectedError } from '@solutions/core/domain'
import type {
  CodeDeliveryFailureError,
  ForbiddenError,
  NotAuthorizedError,
  TooManyRequestsError,
  UserNotFoundError,
} from './errors'

export interface ForgotPasswordParams {
  username: string
}

export interface ForgotPasswordResult {
  attributeName: string
  destination: string
}

export type ForgotPasswordError =
  | CodeDeliveryFailureError
  | ForbiddenError
  | NotAuthorizedError
  | TooManyRequestsError
  | UserNotFoundError
  | UnexpectedError

export interface ForgotPassword {
  execute: (params: ForgotPasswordParams) => Promise<Either<ForgotPasswordError, ForgotPasswordResult>>
}
