import type {
  ForbiddenError,
  NotAuthorizedError,
  PasswordResetRequiredError,
  TooManyRequestsError,
  UserHasMultipleTenantsError,
  UserNotConfirmedError,
  UserNotFoundError,
} from '@/domain/usecases/errors';
import type { Either, UnexpectedError } from '@solutions/core/domain';

export type SigninParams = {
  email: string;
  password: string;
  tenantCode?: string;
  mfaRequired?: boolean;
};

export type InitSigninResult = {
  challengeName: string;
  session: string;
  secretCode?: string;
};

export interface SimpleSigninResult {
  token: string;
  accessToken: string;
  refreshToken: string;
}

export type SigninResult = InitSigninResult | SimpleSigninResult;

export type SigninError =
  | UserHasMultipleTenantsError
  | ForbiddenError
  | NotAuthorizedError
  | PasswordResetRequiredError
  | TooManyRequestsError
  | UserNotConfirmedError
  | UserNotFoundError
  | UnexpectedError;

export interface Signin {
  execute: (params: SigninParams) => Promise<Either<SigninError, SigninResult>>;
}
