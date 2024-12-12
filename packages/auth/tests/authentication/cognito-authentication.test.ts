import 'reflect-metadata';
import { faker } from '@faker-js/faker';
import { left } from '@solutions/core/domain';
import { Logger } from '@solutions/logger';
import { CognitoAuthentication } from '../../src';
import type { Authentication, SigninAuthenticationResult } from '../../src/authentication/contracts';
import { deleteUser, prepareUserToTest, resetPassword, updateUserMFA, validCredentials } from './cognito-helper';

type SutTypes = {
  sut: Authentication;
};

const makeSut = (): SutTypes => {
  const logger = new Logger({ level: 'info' });
  const sut = new CognitoAuthentication(
    {
      clientId: process.env.COGNITO_CLIENT_ID ?? '',
      userPoolId: process.env.COGNITO_USER_POOL_ID ?? '',
      region: process.env.COGNITO_REGION ?? 'us-east-1',
    },
    logger,
  );

  return {
    sut,
  };
};

describe('CognitoAuthentication', () => {
  beforeAll(async () => {
    await prepareUserToTest(validCredentials);
  });

  afterAll(async () => {
    await deleteUser({ email: validCredentials.email });
  });

  describe('signin', () => {
    it('should right with tokens when cognito return a success response for user with mfa', async () => {
      const { sut } = makeSut();

      const result = await sut.signin(validCredentials);

      expect(result.isRight()).toBeTruthy();
      expect(result.value).toHaveProperty('accessToken');
      expect(result.value).toHaveProperty('idToken');
      expect(result.value).toHaveProperty('refreshToken');
    });

    it('should right with tokens when cognito return a success response for user without mfa', async () => {
      updateUserMFA({ email: validCredentials.email, flag: false });
      const { sut } = makeSut();

      const result = await sut.signin(validCredentials);

      expect(result.isRight()).toBeTruthy();
      expect(result.value).toHaveProperty('accessToken');
      expect(result.value).toHaveProperty('idToken');
      expect(result.value).toHaveProperty('refreshToken');
    });

    it('shoul left NotAuthorizedException when cognito return a NotAuthorizedException', async () => {
      const { sut } = makeSut();

      const result = await sut.signin({
        email: validCredentials.email,
        password: 'wrong-password',
      });

      expect(result).toEqual(left('NotAuthorizedException'));
    });

    it.skipIf(!process.env.RUN_ALL)(
      'shoul left PasswordResetRequiredException when cognito return a PasswordResetRequiredException',
      async () => {
        await resetPassword({ email: validCredentials.email });

        const { sut } = makeSut();

        const result = await sut.signin(validCredentials);
        expect(result).toEqual(left('PasswordResetRequiredException'));
      },
    );

    it('shoul left UserNotFoundException when cognito return a UserNotFoundException', async () => {
      const { sut } = makeSut();
      const result = await sut.signin({
        email: faker.internet.email(),
        password: faker.internet.password(),
      });

      expect(result.isLeft()).toBeTruthy();
      expect(result.value).toBe('UserNotFoundException');
    });

    // it.todo('shoul left UnexpectedException when cognito return a unexpected exception (not mapped error)')
    it('should left with UnexpectedException when cognito client throw an error', async () => {
      const { sut } = makeSut();

      const result = await sut.signin({
        // @ts-ignore: to test the error
        email: 1,
        password: faker.internet.password(),
      });

      expect(result.isLeft()).toBeTruthy();
      expect(result.value).toBe('UnexpectedException');
    });

    it.todo('shoul left ForbiddenException when cognito return a ForbiddenException');

    it.todo('shoul left TooManyRequestsException when cognito return a TooManyRequestsException');

    it.todo('shoul left UserNotConfirmedException when cognito return a UserNotConfirmedException');
  });

  describe('initSignin', () => {
    it('should right with challenge when cognito return a challenge response', async () => {
      const { sut } = makeSut();

      const result = await sut.initSignin(validCredentials);

      expect(result.isRight()).toBeTruthy();
      expect(result.value).toHaveProperty('challengeName');
      expect(result.value).toHaveProperty('session');
    });

    it('shoul left NotAuthorizedException when cognito return a NotAuthorizedException', async () => {
      const { sut } = makeSut();

      const result = await sut.initSignin({
        email: validCredentials.email,
        password: 'wrong-password',
      });

      expect(result).toEqual(left('NotAuthorizedException'));
    });

    it('should left with UnexpectedException when cognito client throw an error', async () => {
      const { sut } = makeSut();

      const result = await sut.initSignin({
        // @ts-ignore: to test the error
        email: 1,
        password: faker.internet.password(),
      });

      expect(result.isLeft()).toBeTruthy();
      expect(result.value).toBe('UnexpectedException');
    });

    it('shoul left UserNotFoundException when cognito return a UserNotFoundException', async () => {
      const { sut } = makeSut();
      const result = await sut.initSignin({
        email: faker.internet.email(),
        password: faker.internet.password(),
      });

      expect(result.isLeft()).toBeTruthy();
      expect(result.value).toBe('UserNotFoundException');
    });

    it.skipIf(!process.env.RUN_ALL)(
      'shoul left PasswordResetRequiredException when cognito return a PasswordResetRequiredException',
      async () => {
        await resetPassword({ email: validCredentials.email });

        const { sut } = makeSut();

        const result = await sut.initSignin(validCredentials);
        expect(result).toEqual(left('PasswordResetRequiredException'));
      },
    );

    it.todo('should left with UnexpectedException when cognito not return a challenge');
    it.todo('shoul left ForbiddenException when cognito return a ForbiddenException');
    it.todo('shoul left TooManyRequestsException when cognito return a TooManyRequestsException');
    it.todo('shoul left UserNotConfirmedException when cognito return a UserNotConfirmedException');
  });

  describe('respondChallenge', () => {
    it.todo('should left with NotAuthorizedException when cognito return a NotAuthorizedException');
    it.todo('should right with tokens when cognito return a success response for user with mfa');
    it.todo('should left with UnexpectedException when cognito client throw an error');
    it.todo('should left with CodeMismatchException when cognito return a CodeMismatchException');
    it.todo('should left with ExpiredCodeException when cognito return a ExpiredCodeException');
    it.todo('should left with ForbiddenException when cognito return a ForbiddenException');
    it.todo('should left with TooManyRequestsException when cognito return a TooManyRequestsException');
  });

  describe('verify', () => {
    it('should return InvalidTokenError when token is invalid', async () => {
      const { sut } = makeSut();

      const result = await sut.verify('invalid-token');

      expect(result.isLeft()).toBeTruthy();
    });

    it('should left InvalidTokenError when CognitoJwtVerifier throws', async () => {
      const { sut } = makeSut();

      // @ts-ignore: to test the error
      const result = await sut.verify(1);

      expect(result.isLeft()).toBeTruthy();
    });

    it('should return token information when token is valid', async () => {
      const { sut } = makeSut();
      const signinResult = await sut.signin(validCredentials);

      expect(signinResult.isRight()).toBeTruthy();

      const { token } = signinResult.value as SigninAuthenticationResult;

      const result = await sut.verify(token);

      expect(result.isRight()).toBeTruthy();
      expect(result.value).toHaveProperty('email');
      expect(result.value).toHaveProperty('groups');
    });
  });
});
