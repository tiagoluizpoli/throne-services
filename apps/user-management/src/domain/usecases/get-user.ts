import type { Either, UnexpectedError } from '@solutions/core/domain';
import type {
  ForbiddenError,
  NotAuthorizedError,
  TooManyRequestsError,
  UserNotConfirmedError,
  UserNotFoundError,
} from './errors';

export interface GetUserParams {
  username: string;
  email: string;
  tenant: string;
}

export interface GetUserTenantResult {
  code: string;
  name: string;
}
export interface GetUserResult {
  email: string;
  currentTenant: GetUserTenantResult;
  tenants: GetUserTenantResult[];
  services: string[];
  createdAt: Date;
  status: string;
}

export type GetUserError =
  | ForbiddenError
  | NotAuthorizedError
  | UnexpectedError
  | TooManyRequestsError
  | UserNotConfirmedError
  | UserNotFoundError;

export interface GetUser {
  execute(params: GetUserParams): Promise<Either<GetUserError, GetUserResult>>;
}
