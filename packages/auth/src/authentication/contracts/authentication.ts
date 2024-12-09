import type { Either } from '@solutions/core/domain'

const GeneralPossibleErrors = [
  'ForbiddenException',
  'NotAuthorizedException',
  'TooManyRequestsException',
  'UserNotFoundException',
  'UnexpectedException',
]

export interface GetUserParams {
  username: string
}
export type userStatus =
  | 'ARCHIVED'
  | 'COMPROMISED'
  | 'CONFIRMED'
  | 'EXTERNAL_PROVIDER'
  | 'FORCE_CHANGE_PASSWORD'
  | 'RESET_REQUIRED'
  | 'UNCONFIRMED'
  | 'UNKNOWN'

export interface GetUserResult {
  username: string
  email: string
  groups: string[]
  createdAt: Date
  status: userStatus
}

export const GetUserPossibleErrors = [...GeneralPossibleErrors] as const

export type GetUserError = (typeof GetUserPossibleErrors)[number]

export interface SigninAuthenticationParams {
  email: string
  password: string
  metadata?: Record<string, string>
}

export interface SigninAuthenticationResult {
  token: string
  accessToken: string
  refreshToken: string
}

export interface RefreshTokenAuthenticationResult extends Pick<SigninAuthenticationResult, 'accessToken' | 'token'> {}

export interface ChangePasswordParams {
  previousPassword: string
  proposedPassword: string
  accessToken: string
}

export const ChangePasswordPossibleErrors = [
  ...GeneralPossibleErrors,
  'PasswordHistoryPolicyViolationException',
  'InvalidPasswordException',
  'LimitExceededException',
  'PasswordResetRequiredException',
  'UserNotConfirmedException',
] as const

export type ChangePasswordError = (typeof ChangePasswordPossibleErrors)[number]

export interface ForgotPasswordParams {
  username: string
}

export interface ForgotPasswordResult {
  attributeName: string
  deliveryType: 'EMAIL' | 'SMS'
  destination: string
}

export const ForgotPasswordPossibleErrors = [...GeneralPossibleErrors, 'CodeDeliveryFailureException'] as const

export type ForgotPasswordError = (typeof ForgotPasswordPossibleErrors)[number]

export interface ConfirmForgotPasswordParams {
  username: string
  confirmationCode: string
  password: string
}

export const ConfirmForgotPasswordPossibleErrors = [
  ...GeneralPossibleErrors,
  'CodeMismatchException',
  'ExpiredCodeException',
  'InvalidPasswordException',
  'PasswordHistoryPolicyViolationException',
  'TooManyFailedAttemptsException',
] as const

export type ConfirmForgotPasswordError = (typeof ConfirmForgotPasswordPossibleErrors)[number]

export interface SignoutAuthenticationParams {
  accessToken: string
}

export const SignoutAuthenticationPossibleErrors = [
  ...GeneralPossibleErrors,
  'PasswordResetRequiredException',
  'UserNotConfirmedException',
] as const

export type SignoutAuthenticationError = (typeof SignoutAuthenticationPossibleErrors)[number]

export const InitiateAuthenticationPossibleErrors = [
  ...GeneralPossibleErrors,
  'PasswordResetRequiredException',
  'UserNotConfirmedException',
] as const

export type InitiateAuthenticationError = (typeof InitiateAuthenticationPossibleErrors)[number]

export interface InitSigninAuthenticationResult {
  challengeName: string
  session: string
  secretCode?: string
}

export type RespondChallengeAuthParams = {
  challengeName: 'MFA_SETUP' | 'SOFTWARE_TOKEN_MFA'
  session: string
  params: {
    code: string
    username: string
  }
}

export const RespondChallengeAuthPossibleErrors = [
  ...GeneralPossibleErrors,
  'CodeMismatchException',
  'ExpiredCodeException',
] as const

export type RespondChallengeAuthError = (typeof RespondChallengeAuthPossibleErrors)[number]

export type RespondChallengeAuthResult = SigninAuthenticationResult

export type TokenVerifierResult = {
  sub?: string
  email?: string
  groups?: string[]
}

export type TokenVerifierError = 'InvalidTokenError'

export interface Authentication {
  signin: (
    params: SigninAuthenticationParams,
  ) => Promise<Either<InitiateAuthenticationError, SigninAuthenticationResult>>

  initSignin: (
    params: SigninAuthenticationParams,
  ) => Promise<Either<InitiateAuthenticationError, InitSigninAuthenticationResult>>

  respondChallenge: (
    params: RespondChallengeAuthParams,
  ) => Promise<Either<RespondChallengeAuthError, RespondChallengeAuthResult>>

  verify(token: string): Promise<Either<TokenVerifierError, TokenVerifierResult>>

  refreshToken(refreshToken: string): Promise<Either<InitiateAuthenticationError, RefreshTokenAuthenticationResult>>

  // Change password
  changePassword(params: ChangePasswordParams): Promise<Either<ChangePasswordError, void>>

  // Forgot password
  forgotPassword(params: ForgotPasswordParams): Promise<Either<ForgotPasswordError, ForgotPasswordResult>>

  // Confirm forgot password
  confirmForgotPassword(params: ConfirmForgotPasswordParams): Promise<Either<ConfirmForgotPasswordError, void>>

  // Signout
  signout(params: SignoutAuthenticationParams): Promise<Either<SignoutAuthenticationError, void>>

  getUser(params: GetUserParams): Promise<Either<GetUserError, GetUserResult>>
}
