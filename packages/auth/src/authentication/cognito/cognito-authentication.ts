import {
  AdminGetUserCommand,
  AdminListGroupsForUserCommand,
  AssociateSoftwareTokenCommand,
  AuthFlowType,
  ChallengeNameType,
  ChangePasswordCommand,
  CognitoIdentityProviderClient,
  CognitoIdentityProviderServiceException,
  ConfirmForgotPasswordCommand,
  ForgotPasswordCommand,
  GlobalSignOutCommand,
  InitiateAuthCommand,
  type InitiateAuthCommandOutput,
  RespondToAuthChallengeCommand,
  VerifySoftwareTokenCommand,
} from '@aws-sdk/client-cognito-identity-provider'
import { type Either, left, right } from '@solutions/core/domain'
import { type Logger, injectionLoggerTokens } from '@solutions/logger'
import { SRPClient } from 'amazon-user-pool-srp-client'
import { CognitoJwtVerifier, type CognitoJwtVerifierSingleUserPool } from 'aws-jwt-verify/cognito-verifier'
import { inject, injectable } from 'tsyringe'
import { injectionAuthTokens } from '../../injections'
import {
  type Authentication,
  type ChangePasswordError,
  type ChangePasswordParams,
  ChangePasswordPossibleErrors,
  type ConfirmForgotPasswordError,
  type ConfirmForgotPasswordParams,
  ConfirmForgotPasswordPossibleErrors,
  type ForgotPasswordError,
  type ForgotPasswordParams,
  ForgotPasswordPossibleErrors,
  type ForgotPasswordResult,
  type GetUserError,
  type GetUserParams,
  GetUserPossibleErrors,
  type GetUserResult,
  type InitSigninAuthenticationResult,
  type InitiateAuthenticationError,
  type RefreshTokenAuthenticationResult,
  type RespondChallengeAuthError,
  type RespondChallengeAuthParams,
  type RespondChallengeAuthResult,
  type SigninAuthenticationParams,
  type SigninAuthenticationResult,
  type SignoutAuthenticationError,
  type SignoutAuthenticationParams,
  SignoutAuthenticationPossibleErrors,
  type TokenVerifierError,
  type TokenVerifierResult,
} from '../contracts'

export type CognitoAuthenticationConfig = {
  clientId: string
  userPoolId: string
  region: string
}

@injectable()
export class CognitoAuthentication implements Authentication {
  private client: CognitoIdentityProviderClient
  private verifier: CognitoJwtVerifierSingleUserPool<{
    userPoolId: string
    tokenUse: 'access' | 'id'
    clientId: string
  }>
  srp: SRPClient

  constructor(
    @inject(injectionAuthTokens.cognitoAuthenticationConfig) private readonly config: CognitoAuthenticationConfig,
    @inject(injectionLoggerTokens.logger) private readonly logger: Logger,
  ) {
    this.client = new CognitoIdentityProviderClient({
      region: this.config.region,
    })
    this.verifier = CognitoJwtVerifier.create({
      userPoolId: this.config.userPoolId,
      clientId: this.config.clientId,
      tokenUse: 'id',
    })
    this.srp = new SRPClient(this.config.userPoolId)
  }
  async getUser(params: GetUserParams): Promise<Either<GetUserError, GetUserResult>> {
    const { username } = params
    try {
      const getUserResult = await this.client.send(
        new AdminGetUserCommand({
          UserPoolId: this.config.userPoolId,
          Username: username,
        }),
      )

      const listUserGroupsResult = await this.client.send(
        new AdminListGroupsForUserCommand({
          UserPoolId: this.config.userPoolId,
          Username: username,
        }),
      )

      return right({
        username: getUserResult.Username!,
        email: getUserResult.UserAttributes!.find((attr) => attr.Name === 'email')!.Value!,
        groups: listUserGroupsResult.Groups!.map((group) => group.GroupName!),
        createdAt: new Date(getUserResult.UserCreateDate!),
        status: getUserResult.UserStatus!,
      })
    } catch (error) {
      return this.catchBlock({
        error,
        functionName: 'getUser',
        possibleErrors: [...GetUserPossibleErrors],
      })
    }
  }

  async changePassword(params: ChangePasswordParams): Promise<Either<ChangePasswordError, void>> {
    const { accessToken, previousPassword, proposedPassword } = params

    try {
      await this.client.send(
        new ChangePasswordCommand({
          AccessToken: accessToken,
          PreviousPassword: previousPassword,
          ProposedPassword: proposedPassword,
        }),
      )

      return right(undefined)
    } catch (error) {
      return this.catchBlock({
        error,
        functionName: 'changePassword',
        possibleErrors: [...ChangePasswordPossibleErrors],
      })
    }
  }
  async forgotPassword(params: ForgotPasswordParams): Promise<Either<ForgotPasswordError, ForgotPasswordResult>> {
    const { username } = params

    try {
      const forgotPasswordResult = await this.client.send(
        new ForgotPasswordCommand({
          ClientId: this.config.clientId,
          Username: username,
        }),
      )

      const { CodeDeliveryDetails } = forgotPasswordResult

      return right({
        attributeName: CodeDeliveryDetails!.AttributeName!,
        deliveryType: CodeDeliveryDetails!.DeliveryMedium!,
        destination: CodeDeliveryDetails!.Destination!,
      })
    } catch (error) {
      return this.catchBlock({
        error,
        functionName: 'forgotPassword',
        possibleErrors: [...ForgotPasswordPossibleErrors],
      })
    }
  }

  async confirmForgotPassword(params: ConfirmForgotPasswordParams): Promise<Either<ConfirmForgotPasswordError, void>> {
    const { username, password, confirmationCode } = params
    try {
      await this.client.send(
        new ConfirmForgotPasswordCommand({
          ClientId: this.config.clientId,
          Username: username,
          ConfirmationCode: confirmationCode,
          Password: password,
        }),
      )

      return right(undefined)
    } catch (error) {
      return this.catchBlock({
        error,
        functionName: 'confirmForgotPassword',
        possibleErrors: [...ConfirmForgotPasswordPossibleErrors],
      })
    }
  }
  async signout(params: SignoutAuthenticationParams): Promise<Either<SignoutAuthenticationError, void>> {
    const { accessToken } = params

    try {
      await this.client.send(
        new GlobalSignOutCommand({
          AccessToken: accessToken,
        }),
      )

      return right(undefined)
    } catch (error) {
      return this.catchBlock({
        error,
        functionName: 'signout',
        possibleErrors: [...SignoutAuthenticationPossibleErrors],
      })
    }
  }

  async signin(
    params: SigninAuthenticationParams,
  ): Promise<Either<InitiateAuthenticationError, SigninAuthenticationResult>> {
    const { email, password } = params

    try {
      this.logger.info(`CognitoAuthentication.signin :: Trying to authenticate user with email: ${email}`)
      const userPassAuthFlowResponse = await this.client.send(
        new InitiateAuthCommand({
          ClientId: this.config.clientId,
          AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
          AuthParameters: {
            USERNAME: email,
            PASSWORD: password,
          },
        }),
      )

      if (this.responseHasTokens(userPassAuthFlowResponse)) {
        this.logger.info(`CognitoAuthentication.signin :: User authenticated with email: ${email}`)

        return right({
          token: userPassAuthFlowResponse.AuthenticationResult!.IdToken!,
          accessToken: userPassAuthFlowResponse.AuthenticationResult!.AccessToken!,
          refreshToken: userPassAuthFlowResponse.AuthenticationResult!.RefreshToken!,
        })
      }

      if (!this.responseHasExpectedChallenge(userPassAuthFlowResponse)) {
        this.logger.error(
          `CognitoAuthentication.signin :: ChallengeName is not MFA_SETUP or SOFTWARE_TOKEN_MFA: ${JSON.stringify(
            userPassAuthFlowResponse,
          )}`,
        )

        return left('UnexpectedException')
      }

      const customAuthFlowResponse = await this.client.send(
        new InitiateAuthCommand({
          ClientId: this.config.clientId,
          AuthFlow: AuthFlowType.CUSTOM_AUTH,
          AuthParameters: {
            ChallengeName: 'SRP_A',
            USERNAME: email,
            PASSWORD: password,
            SRP_A: this.srp.calculateA(),
          },
        }),
      )

      if (!customAuthFlowResponse.AuthenticationResult) {
        this.logger.error(
          `CognitoAuthentication.signin :: response.AuthenticationResult is falsy: ${JSON.stringify(customAuthFlowResponse)}`,
        )

        return left('UnexpectedException')
      }

      if (!this.responseHasTokens(customAuthFlowResponse)) {
        this.logger.error(
          `CognitoAuthentication.signin :: IdToken, AccessToken or RefreshToken is falsy: ${JSON.stringify(customAuthFlowResponse)}`,
        )

        return left('UnexpectedException')
      }

      this.logger.info(`CognitoAuthentication.signin :: User authenticated with email: ${email}`)

      return right({
        token: customAuthFlowResponse.AuthenticationResult.IdToken!,
        accessToken: customAuthFlowResponse.AuthenticationResult.AccessToken!,
        refreshToken: customAuthFlowResponse.AuthenticationResult.RefreshToken!,
      })
    } catch (error) {
      this.logger.error(`CognitoAuthentication.signin :: Error: ${JSON.stringify(error)}`)

      if (error instanceof CognitoIdentityProviderServiceException) {
        const errorName = error.name

        if (
          errorName === 'ForbiddenException' ||
          errorName === 'NotAuthorizedException' ||
          errorName === 'PasswordResetRequiredException' ||
          errorName === 'TooManyRequestsException' ||
          errorName === 'UserNotConfirmedException' ||
          errorName === 'UserNotFoundException'
        ) {
          this.logger.error(`CognitoAuthentication.signin :: Error mapped to: ${errorName}`)

          return left(errorName)
        }

        this.logger.error(`CognitoAuthentication.signin :: Error not mapped: ${errorName}`)
      }

      return left('UnexpectedException')
    }
  }

  async initSignin(
    params: SigninAuthenticationParams,
  ): Promise<Either<InitiateAuthenticationError, InitSigninAuthenticationResult>> {
    const { email, password, metadata } = params

    const command = new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
      ClientId: this.config.clientId,
      ClientMetadata: {
        ...metadata,
        requiredMfa: 'true',
      },
    })

    try {
      this.logger.info(`CognitoAuthentication.initSignin :: Trying to authenticate user with email: ${email}`)
      const response = await this.client.send(command)

      if (!response.ChallengeName || !response.Session) {
        this.logger.error(
          `CognitoAuthentication.initSignin :: ChallengeName or Session is falsy: ${JSON.stringify(response)}`,
        )

        return left('UnexpectedException')
      }

      this.logger.info(`CognitoAuthentication.initSignin :: User challenged with email: ${email}`)

      if (response.ChallengeName !== 'MFA_SETUP') {
        return right({
          challengeName: response.ChallengeName,
          session: response.Session,
        })
      }

      this.logger.info('CognitoAuthentication.initSignin :: User challenged with MFA_SETUP, associating software token')

      const associateSoftwareTokenResult = await this.client.send(
        new AssociateSoftwareTokenCommand({
          Session: response.Session,
        }),
      )

      if (!associateSoftwareTokenResult.Session || !associateSoftwareTokenResult.SecretCode) {
        this.logger.error(
          `CognitoAuthentication.initSignin :: SecretCode is falsy: ${JSON.stringify(associateSoftwareTokenResult)}`,
        )

        return left('UnexpectedException')
      }

      return right({
        challengeName: response.ChallengeName,
        session: associateSoftwareTokenResult.Session,
        secretCode: associateSoftwareTokenResult.SecretCode,
      })
    } catch (error) {
      this.logger.error(`CognitoAuthentication.initSignin :: Error: ${JSON.stringify(error)}`)

      if (error instanceof CognitoIdentityProviderServiceException) {
        const errorName = error.name

        if (
          errorName === 'ForbiddenException' ||
          errorName === 'NotAuthorizedException' ||
          errorName === 'PasswordResetRequiredException' ||
          errorName === 'TooManyRequestsException' ||
          errorName === 'UserNotConfirmedException' ||
          errorName === 'UserNotFoundException'
        ) {
          this.logger.error(`CognitoAuthentication.initSignin :: Error mapped to: ${errorName}`)

          return left(errorName)
        }

        this.logger.error(`CognitoAuthentication.initSignin :: Error not mapped: ${errorName}`)
      }

      return left('UnexpectedException')
    }
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<Either<InitiateAuthenticationError, RefreshTokenAuthenticationResult>> {
    try {
      this.logger.info('CognitoAuthentication.refreshToken :: Trying to refresh token')
      const refreshTokenAuthFlowResponse = await this.client.send(
        new InitiateAuthCommand({
          ClientId: this.config.clientId,
          AuthFlow: AuthFlowType.REFRESH_TOKEN,
          AuthParameters: {
            REFRESH_TOKEN: refreshToken,
          },
        }),
      )
      if (this.responseHasTokens(refreshTokenAuthFlowResponse)) {
        this.logger.info('CognitoAuthentication.refreshToken :: User tokens refreshed')

        return right({
          accessToken: refreshTokenAuthFlowResponse.AuthenticationResult!.AccessToken!,
          token: refreshTokenAuthFlowResponse.AuthenticationResult!.IdToken!,
        })
      }

      this.logger.error(
        `CognitoAuthentication.signin :: IdToken or AccessToken is falsy ${JSON.stringify(refreshTokenAuthFlowResponse)}`,
      )
      return left('UnexpectedException')
    } catch (error) {
      this.logger.error(`CognitoAuthentication.refreshToken :: Error: ${JSON.stringify(error)}`)

      if (error instanceof CognitoIdentityProviderServiceException) {
        const errorName = error.name

        if (
          errorName === 'ForbiddenException' ||
          errorName === 'NotAuthorizedException' ||
          errorName === 'PasswordResetRequiredException' ||
          errorName === 'TooManyRequestsException' ||
          errorName === 'UserNotConfirmedException' ||
          errorName === 'UserNotFoundException'
        ) {
          this.logger.error(`CognitoAuthentication.refreshToken :: Error mapped to: ${errorName}`)

          return left(errorName)
        }

        this.logger.error(`CognitoAuthentication.refreshToken :: Error not mapped: ${errorName}`)
      }
      return left('UnexpectedException')
    }
  }

  async respondChallenge(
    params: RespondChallengeAuthParams,
  ): Promise<Either<RespondChallengeAuthError, RespondChallengeAuthResult>> {
    try {
      let session = params.session

      const challengeResponses: any = {
        USERNAME: params.params.username,
      }

      if (params.challengeName === 'SOFTWARE_TOKEN_MFA') {
        challengeResponses.SOFTWARE_TOKEN_MFA_CODE = params.params.code
      }

      if (params.challengeName === 'MFA_SETUP') {
        this.logger.info('CognitoAuthentication.respondChallenge :: Verifying software token')

        const verifySoftwareTokenResult = await this.client.send(
          new VerifySoftwareTokenCommand({
            UserCode: params.params.code,
            Session: params.session,
          }),
        )

        if (!verifySoftwareTokenResult.Session) {
          this.logger.error(
            `CognitoAuthentication.respondChallenge :: Session is falsy: ${JSON.stringify(verifySoftwareTokenResult)}`,
          )

          return left('UnexpectedException')
        }

        session = verifySoftwareTokenResult.Session
      }

      this.logger.info('CognitoAuthentication.respondChallenge :: Responding to challenge')

      const response = await this.client.send(
        new RespondToAuthChallengeCommand({
          ClientId: this.config.clientId,
          ChallengeName: params.challengeName,
          Session: session,
          ChallengeResponses: challengeResponses,
        }),
      )

      if (!this.responseHasTokens(response)) {
        this.logger.error('CognitoAuthentication.respondChallenge :: IdToken, AccessToken or RefreshToken is falsy')

        return left('UnexpectedException')
      }

      this.logger.info('CognitoAuthentication.respondChallenge :: User authenticated')

      return right({
        token: response.AuthenticationResult!.IdToken!,
        accessToken: response.AuthenticationResult!.AccessToken!,
        refreshToken: response.AuthenticationResult!.RefreshToken!,
      })
    } catch (error) {
      this.logger.error(`CognitoAuthentication.respondChallenge :: Error: ${JSON.stringify(error)}`)

      if (error instanceof CognitoIdentityProviderServiceException) {
        const errorName = error.name

        if (
          errorName === 'CodeMismatchException' ||
          errorName === 'ExpiredCodeException' ||
          errorName === 'ForbiddenException' ||
          errorName === 'NotAuthorizedException' ||
          errorName === 'TooManyRequestsException' ||
          errorName === 'InvalidParameterException'
        ) {
          this.logger.error(`CognitoAuthentication.respondChallenge :: Error mapped to: ${errorName}`)

          return left(errorName)
        }

        this.logger.error(`CognitoAuthentication.respondChallenge :: Error not mapped: ${errorName}`)
      }

      return left('UnexpectedException')
    }
  }

  async verify(token: string): Promise<Either<TokenVerifierError, TokenVerifierResult>> {
    try {
      const payload = await this.verifier.verify(token)

      return right({
        email: payload.email as string,
        sub: payload.sub,
        groups: payload['cognito:groups'],
      })
    } catch (error) {
      this.logger.error(`CognitoAuthentication.verify :: Error: ${JSON.stringify(error)}`)
      return left('InvalidTokenError')
    }
  }

  private responseHasTokens(response: InitiateAuthCommandOutput): boolean {
    return !!response.AuthenticationResult?.IdToken && !!response.AuthenticationResult.AccessToken
  }

  private responseHasExpectedChallenge(response: InitiateAuthCommandOutput): boolean {
    return (
      response.ChallengeName === ChallengeNameType.MFA_SETUP ||
      response.ChallengeName === ChallengeNameType.SOFTWARE_TOKEN_MFA
    )
  }

  private catchBlock({
    error,
    functionName,
    possibleErrors,
  }: { error: unknown; functionName: string; possibleErrors: string[] }): Either<any, any> {
    if (error instanceof CognitoIdentityProviderServiceException) {
      const errorName = error.name

      if (possibleErrors.includes(errorName)) {
        this.logger.info(`CognitoAuthentication.${functionName} :: Error mapped to: ${errorName}`)

        return left(errorName)
      }

      this.logger.error(`CognitoAuthentication.${functionName} :: Error not mapped: ${errorName}`)
    }

    return left('UnexpectedException')
  }
}
