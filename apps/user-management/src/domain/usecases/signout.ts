import type { Either, UnexpectedError } from '@solutions/core/domain';
import type {
  ForbiddenError,
  NotAuthorizedError,
  PasswordResetRequiredError,
  TooManyRequestsError,
  UserHasMultipleTenantsError,
  UserNotConfirmedError,
  UserNotFoundError,
} from './errors';

export interface SignoutParams {
  accessToken: string;
}

export type SignoutError =
  | UserHasMultipleTenantsError
  | ForbiddenError
  | NotAuthorizedError
  | PasswordResetRequiredError
  | TooManyRequestsError
  | UserNotConfirmedError
  | UserNotFoundError
  | UnexpectedError;

export interface Signout {
  execute: (params: SignoutParams) => Promise<Either<SignoutError, void>>;
}
