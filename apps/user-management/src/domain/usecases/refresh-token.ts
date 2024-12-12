import type {
  ForbiddenError,
  NotAuthorizedError,
  PasswordResetRequiredError,
  PreviousSessionNotFoundError,
  TooManyRequestsError,
  UserHasMultipleTenantsError,
  UserNotConfirmedError,
  UserNotFoundError,
} from '@/domain/usecases/errors';
import type { Either, UnexpectedError } from '@solutions/core/domain';

export interface RefreshTokenParams {
  refreshToken: string;
}

export interface RefreshTokenResult {
  accessToken: string;
  token: string;
}

export type RefreshTokenError =
  | PreviousSessionNotFoundError
  | UserHasMultipleTenantsError
  | ForbiddenError
  | NotAuthorizedError
  | PasswordResetRequiredError
  | TooManyRequestsError
  | UserNotConfirmedError
  | UserNotFoundError
  | UnexpectedError;

export interface RefreshToken {
  execute: (params: RefreshTokenParams) => Promise<Either<RefreshTokenError, RefreshTokenResult>>;
}
