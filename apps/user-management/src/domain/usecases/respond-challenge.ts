import type {
  ChallengeSessionNotFoundError,
  CodeMismatchError,
  ExpiredCodeError,
  ForbiddenError,
  NotAuthorizedError,
  TooManyRequestsError,
} from '@/domain/usecases/errors';
import type { Either, UnexpectedError } from '@solutions/core/domain';

export type RespondChallengeParams = {
  challengeName: 'MFA_SETUP' | 'SOFTWARE_TOKEN_MFA';
  session: string;
  params: {
    code: string;
  };
};

export type RespondChallengeError =
  | ChallengeSessionNotFoundError
  | CodeMismatchError
  | ExpiredCodeError
  | ForbiddenError
  | NotAuthorizedError
  | TooManyRequestsError
  | UnexpectedError;

export type RespondChallengeResult = {
  token: string;
  accessToken: string;
  refreshToken: string;
};

export interface RespondChallenge {
  execute: (params: RespondChallengeParams) => Promise<Either<RespondChallengeError, RespondChallengeResult>>;
}
