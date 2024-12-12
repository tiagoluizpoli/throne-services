import {
  CodeDeliveryFailureError,
  CodeMismatchError,
  ExpiredCodeError,
  ForbiddenError,
  InvalidPasswordError,
  NotAuthorizedError,
  PasswordPreviouslyUsedError,
  PasswordResetRequiredError,
  TooManyRequestsError,
  UserNotConfirmedError,
  UserNotFoundError,
} from '@/domain';
import type { InitiateAuthenticationError, RespondChallengeAuthError } from '@solutions/auth';
import { UnexpectedError, type UseCaseError } from '@solutions/core/domain';

export const authenticationErrorMapper: Record<InitiateAuthenticationError, UseCaseError> = {
  ForbiddenException: new ForbiddenError(),
  NotAuthorizedException: new NotAuthorizedError(),
  PasswordResetRequiredException: new PasswordResetRequiredError(),
  InvalidPasswordException: new InvalidPasswordError(),
  TooManyRequestsException: new TooManyRequestsError(),
  UserNotConfirmedException: new UserNotConfirmedError(),
  UserNotFoundException: new UserNotFoundError(),
  UnexpectedException: new UnexpectedError(),

  CodeMismatchException: new CodeMismatchError(),
  ExpiredCodeException: new ExpiredCodeError(),
  PasswordHistoryPolicyViolationException: new PasswordPreviouslyUsedError(),
  CodeDeliveryFailureException: new CodeDeliveryFailureError(),
  LimitExceededException: new TooManyRequestsError(),
  TooManyFailedAttemptsException: new TooManyRequestsError(),
};

export const challengeErrorMapper: Record<RespondChallengeAuthError, UseCaseError> = {
  CodeMismatchException: new CodeMismatchError(),
  ExpiredCodeException: new ExpiredCodeError(),
  ForbiddenException: new ForbiddenError(),
  NotAuthorizedException: new NotAuthorizedError(),
  TooManyRequestsException: new TooManyRequestsError(),
  UnexpectedException: new UnexpectedError(),
  InvalidParameterException: new NotAuthorizedError(),
};
