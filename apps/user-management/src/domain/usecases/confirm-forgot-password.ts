import type { Either, UnexpectedError } from '@solutions/core/domain';
import type {
  CodeMismatchError,
  ExpiredCodeError,
  ForbiddenError,
  InvalidPasswordError,
  NotAuthorizedError,
  PasswordPreviouslyUsedError,
  TooManyRequestsError,
  UserNotFoundError,
} from './errors';

export interface ConfirmForgotPasswordParams {
  username: string;
  confirmationCode: string;
  password: string;
}

export type ConfirmForgotPasswordError =
  | ForbiddenError
  | NotAuthorizedError
  | TooManyRequestsError
  | CodeMismatchError
  | ExpiredCodeError
  | InvalidPasswordError
  | PasswordPreviouslyUsedError
  | UserNotFoundError
  | UnexpectedError;

export interface ConfirmForgotPassword {
  execute: (params: ConfirmForgotPasswordParams) => Promise<Either<ConfirmForgotPasswordError, void>>;
}
