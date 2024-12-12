import { faker } from '@faker-js/faker';
import { type Either, left, right } from '@solutions/core/domain';
import { inject, injectable } from 'tsyringe';
import type {
  Authentication,
  ChangePasswordError,
  ChangePasswordParams,
  ConfirmForgotPasswordError,
  ConfirmForgotPasswordParams,
  ForgotPasswordError,
  ForgotPasswordParams,
  ForgotPasswordResult,
  GetUserError,
  GetUserParams,
  GetUserResult,
  InitSigninAuthenticationResult,
  InitiateAuthenticationError,
  RefreshTokenAuthenticationResult,
  RespondChallengeAuthError,
  RespondChallengeAuthParams,
  RespondChallengeAuthResult,
  SigninAuthenticationParams,
  SigninAuthenticationResult,
  SignoutAuthenticationError,
  SignoutAuthenticationParams,
  TokenVerifierError,
  TokenVerifierResult,
} from '../contracts';

export interface TokenParams {
  verifiedToken: string;
  email: string;
  groups: string[];
}

@injectable()
export class MockAuthentication implements Authentication {
  constructor(@inject('TokenParams') public readonly tokenParams?: TokenParams[]) {}
  changePassword = async (params: ChangePasswordParams): Promise<Either<ChangePasswordError, void>> => {
    return right(undefined);
  };
  async forgotPassword(params: ForgotPasswordParams): Promise<Either<ForgotPasswordError, ForgotPasswordResult>> {
    return right({
      attributeName: faker.string.alphanumeric(10),
      deliveryType: 'EMAIL',
      destination: faker.internet.email(),
    });
  }
  async confirmForgotPassword(params: ConfirmForgotPasswordParams): Promise<Either<ConfirmForgotPasswordError, void>> {
    return right(undefined);
  }
  async signout(params: SignoutAuthenticationParams): Promise<Either<SignoutAuthenticationError, void>> {
    return right(undefined);
  }
  async getUser(params: GetUserParams): Promise<Either<GetUserError, GetUserResult>> {
    return right({
      username: faker.string.alphanumeric(),
      email: faker.internet.email(),
      groups: faker.lorem.words(3).split(' '),
      createdAt: new Date(),
      status: 'CONFIRMED',
    });
  }

  signin = async (
    params: SigninAuthenticationParams,
  ): Promise<Either<InitiateAuthenticationError, SigninAuthenticationResult>> => {
    return right({ token: faker.string.uuid(), accessToken: faker.string.uuid(), refreshToken: faker.string.uuid() });
  };

  async initSignin(
    params: SigninAuthenticationParams,
  ): Promise<Either<InitiateAuthenticationError, InitSigninAuthenticationResult>> {
    return right({ challengeName: 'MFA', session: faker.string.uuid() });
  }

  async respondChallenge(
    params: RespondChallengeAuthParams,
  ): Promise<Either<RespondChallengeAuthError, RespondChallengeAuthResult>> {
    return right({ token: faker.string.uuid(), accessToken: faker.string.uuid(), refreshToken: faker.string.uuid() });
  }

  async verify(token: string): Promise<Either<TokenVerifierError, TokenVerifierResult>> {
    const foundTokenParams = this.tokenParams?.find((params) => params.verifiedToken === token);

    if (!foundTokenParams) {
      return left('InvalidTokenError');
    }

    return right({
      email: foundTokenParams.email,
      groups: foundTokenParams.groups,
    });
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<Either<InitiateAuthenticationError, RefreshTokenAuthenticationResult>> {
    return right({
      token: faker.string.uuid(),
      accessToken: faker.string.uuid(),
    });
  }
}
