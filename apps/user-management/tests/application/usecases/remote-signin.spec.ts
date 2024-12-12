import 'reflect-metadata';
import { RemoteSignin } from '@/application';
import {
  ForbiddenError,
  type InitSigninResult,
  NotAuthorizedError,
  PasswordResetRequiredError,
  type SimpleSigninResult,
  TooManyRequestsError,
  UserHasMultipleTenantsError,
  UserNotConfirmedError,
  UserNotFoundError,
} from '@/domain';
import { faker } from '@faker-js/faker';
import { type Authentication, type InitiateAuthenticationError, MockAuthentication } from '@solutions/auth';
import { getHash } from '@solutions/core/domain';
import { UnexpectedError, left } from '@solutions/core/domain';
import { Logger } from '@solutions/logger';
import {
  InMemorySessionChallengeRepository,
  InMemorySessionRepository,
  InMemoryUsersRepository,
  type User,
} from '@solutions/shared-database';
import { mockTenant, mockUser } from '@solutions/shared-database/tests';

const initialUser = mockUser();

const makeRandomSutParams = () => ({
  email: faker.internet.email(),
  password: faker.internet.password({ length: 10 }),
  tenantCode: faker.string.alpha({ length: 5 }),
  mfaRequired: faker.datatype.boolean(),
});

const makeValidSutParams = ({ mfaRequired }: { mfaRequired: boolean } = { mfaRequired: true }) => ({
  email: initialUser.email,
  password: faker.internet.password({ length: 10 }),
  tenantCode: initialUser.tenants[0].code,
  mfaRequired,
});

type SutParams = {
  initialUsers?: User[];
};

type SutTypes = {
  sut: RemoteSignin;
  authentication: Authentication;
  usersRepository: InMemoryUsersRepository;
  sessionRepository: InMemorySessionRepository;
  sessionChallengeRepository: InMemorySessionChallengeRepository;
};

const makeSut = ({ initialUsers = [] }: SutParams = {}): SutTypes => {
  const authentication = new MockAuthentication();
  const usersRepository = new InMemoryUsersRepository([initialUser, ...initialUsers]);
  const sessionRepository = new InMemorySessionRepository();
  const sessionChallengeRepository = new InMemorySessionChallengeRepository();
  const logger = new Logger({ level: 'error' });
  const sut = new RemoteSignin(authentication, usersRepository, sessionRepository, sessionChallengeRepository, logger);

  return {
    sut,
    authentication,
    usersRepository,
    sessionRepository,
    sessionChallengeRepository,
  };
};

describe('RemoteSignin', () => {
  it('should left a UserNotFoundError when userRepository.getByEmail return undefined', async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...makeRandomSutParams(),
      tenantCode: undefined,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });

  it('should left a UserHasMultipleTenantsError when user has multiple tenants', async () => {
    const user = mockUser({ tenants: [mockTenant(), mockTenant()] });
    const { sut } = makeSut({ initialUsers: [user] });

    const result = await sut.execute({
      ...makeRandomSutParams(),
      email: user.email,
      tenantCode: undefined,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserHasMultipleTenantsError);
  });

  it('should left a UserHasMultipleTenantsError when user has no tenant', async () => {
    const user = mockUser({ tenants: [] });
    const { sut } = makeSut({ initialUsers: [user] });

    const result = await sut.execute({
      ...makeRandomSutParams(),
      email: user.email,
      tenantCode: undefined,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserHasMultipleTenantsError);
  });

  it('should left a UserNotFoundError.getByField when userRepository return undefined', async () => {
    const { sut } = makeSut();

    const result = await sut.execute(makeRandomSutParams());

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });

  it('should left a UserNotFoundError when tenant is not associated with the user', async () => {
    const initialUsers = [mockUser()];
    const { sut } = makeSut({ initialUsers });

    const result = await sut.execute({
      ...makeRandomSutParams(),
      email: initialUsers[0].email,
      tenantCode: 'inexistent-tenant',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });

  it('should throw if usersRepository.getByField throws', async () => {
    const { sut, usersRepository } = makeSut();

    vi.spyOn(usersRepository, 'getByField').mockImplementation(() => {
      throw new Error();
    });

    const result = sut.execute(makeRandomSutParams());

    await expect(result).rejects.toThrow();
  });

  it('should call authentication.initSignin with correct values when mfaRequired is true', async () => {
    const { sut, authentication } = makeSut();
    const spy = vi.spyOn(authentication, 'initSignin');

    const params = makeValidSutParams();

    const result = await sut.execute(params);

    expect(result.isRight()).toBe(true);
    expect(spy).toHaveBeenCalledWith({ email: params.email, password: params.password });
  });

  it('should call authentication.initSignin with correct values when no tenantCode is provided', async () => {
    const user = mockUser({ tenants: [mockTenant()] });
    const { sut, authentication } = makeSut({ initialUsers: [user] });
    const spy = vi.spyOn(authentication, 'initSignin');

    const params = makeValidSutParams();

    const result = await sut.execute({ ...params, tenantCode: undefined, email: user.email });

    expect(result.isRight()).toBe(true);
    expect(spy).toHaveBeenCalledWith({ email: user.email, password: params.password });
  });

  it.each([
    { initSigninResult: 'ForbiddenException', expectedError: ForbiddenError },
    { initSigninResult: 'NotAuthorizedException', expectedError: NotAuthorizedError },
    { initSigninResult: 'PasswordResetRequiredException', expectedError: PasswordResetRequiredError },
    { initSigninResult: 'TooManyRequestsException', expectedError: TooManyRequestsError },
    { initSigninResult: 'UserNotConfirmedException', expectedError: UserNotConfirmedError },
    { initSigninResult: 'UserNotFoundException', expectedError: UserNotFoundError },
    { initSigninResult: 'UnexpectedException', expectedError: UnexpectedError },
  ])(
    'should left $expectedError when authentication.initSignin left a $initSigninResult',
    async ({ initSigninResult, expectedError }) => {
      const { sut, authentication } = makeSut();
      vi.spyOn(authentication, 'initSignin').mockResolvedValueOnce(
        left(initSigninResult as InitiateAuthenticationError),
      );

      const result = await sut.execute(makeValidSutParams());

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(expectedError);
    },
  );

  it('should right a SigninResult when authentication.initSignin rigth a success result', async () => {
    const { sut } = makeSut();

    const result = await sut.execute(makeValidSutParams());

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      challengeName: 'MFA',
      session: expect.any(String),
    });
  });

  it('should throw if authentication.initSignin throws', async () => {
    const { sut, authentication } = makeSut();

    vi.spyOn(authentication, 'initSignin').mockImplementation(() => {
      throw new Error();
    });

    const result = sut.execute(makeValidSutParams());

    await expect(result).rejects.toThrow();
  });

  it('should call authentication.signin with correct values when mfaRequired is falsy', async () => {
    const { sut, authentication } = makeSut();
    const spy = vi.spyOn(authentication, 'signin');

    const params = makeValidSutParams({ mfaRequired: false });

    await sut.execute(params);

    expect(spy).toHaveBeenCalledWith({ email: params.email, password: params.password });
  });

  it('should call authentication.signin with correct values when no tenantCode is provided', async () => {
    const user = mockUser({ tenants: [mockTenant()] });
    const { sut, authentication } = makeSut({ initialUsers: [user] });
    const spy = vi.spyOn(authentication, 'signin');

    const params = makeValidSutParams({ mfaRequired: false });

    await sut.execute({ ...params, tenantCode: undefined, email: user.email });

    expect(spy).toHaveBeenCalledWith({ email: user.email, password: params.password });
  });

  it.each([
    { signinResult: 'ForbiddenException', expectedError: ForbiddenError },
    { signinResult: 'NotAuthorizedException', expectedError: NotAuthorizedError },
    { signinResult: 'PasswordResetRequiredException', expectedError: PasswordResetRequiredError },
    { signinResult: 'TooManyRequestsException', expectedError: TooManyRequestsError },
    { signinResult: 'UserNotConfirmedException', expectedError: UserNotConfirmedError },
    { signinResult: 'UserNotFoundException', expectedError: UserNotFoundError },
    { signinResult: 'UnexpectedException', expectedError: UnexpectedError },
  ])(
    'should left $expectedError when authentication.signin left a $signinResult',
    async ({ signinResult, expectedError }) => {
      const { sut, authentication } = makeSut();

      vi.spyOn(authentication, 'signin').mockResolvedValueOnce(left(signinResult as InitiateAuthenticationError));

      const result = await sut.execute(makeValidSutParams({ mfaRequired: false }));

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(expectedError);
    },
  );

  it('should right a SigninResult when authentication.signin right a success result', async () => {
    const { sut } = makeSut();

    const result = await sut.execute(makeValidSutParams({ mfaRequired: false }));

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      token: expect.any(String),
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });
  });

  it('should throw if authentication.signin throws', async () => {
    const { sut, authentication } = makeSut();

    vi.spyOn(authentication, 'signin').mockImplementation(() => {
      throw new Error();
    });

    const result = sut.execute(makeValidSutParams({ mfaRequired: false }));

    await expect(result).rejects.toThrow();
  });

  it('should call sessionRepository.save with correct values if mfaRequired is false', async () => {
    const { sut, sessionRepository } = makeSut();

    const sessionSpy = vi.spyOn(sessionRepository, 'save');

    const params = makeValidSutParams({ mfaRequired: false });

    const response = await sut.execute(params);

    const hashedToken = getHash({ content: (response.value as SimpleSigninResult).token });

    expect(response.isRight()).toBe(true);
    expect(sessionSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        tenantCode: params.tenantCode,
        userId: initialUser.id,
        tokenIdentifier: hashedToken,
        createdAt: expect.any(Date),
      }),
    );
  });

  it('should throw if sessionRepository.save throws', async () => {
    const { sut, sessionRepository } = makeSut();
    vi.spyOn(sessionRepository, 'save').mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.execute(makeValidSutParams({ mfaRequired: false }));

    expect(promise).rejects.toThrow();
  });

  it('should store the session to the database if authentication.signin right a success result', async () => {
    const { sut, sessionRepository } = makeSut();

    const result = await sut.execute(makeValidSutParams({ mfaRequired: false }));
    const hashedToken = getHash({ content: (result.value as SimpleSigninResult).token });

    const session = sessionRepository.sessions.find((s) => s.tokenIdentifier === hashedToken);

    expect(result.isRight()).toBe(true);
    expect(sessionRepository.sessions.length).toBeGreaterThan(0);
    expect(session).toEqual(
      expect.objectContaining({
        tenantCode: initialUser.tenants[0].code,
        userId: initialUser.id,
        tokenIdentifier: hashedToken,
        createdAt: expect.any(Date),
      }),
    );
  });

  it('should call sessionChallengeRepository.save with correct values if mfaRequired is true', async () => {
    const { sut, sessionChallengeRepository } = makeSut();

    const spy = vi.spyOn(sessionChallengeRepository, 'save');

    const result = await sut.execute(makeValidSutParams({ mfaRequired: true }));
    const hashedSession = getHash({ content: (result.value as InitSigninResult).session });

    expect(result.isRight()).toBe(true);
    expect(sessionChallengeRepository.sessionChallenges.length).toBeGreaterThan(0);
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        tenantCode: initialUser.tenants[0].code,
        userId: initialUser.id,
        sessionIdentifier: hashedSession,
        createdAt: expect.any(Date),
      }),
    );
  });

  it('should throw if sessionChallengeRepository.save throws', async () => {
    const { sut, sessionChallengeRepository } = makeSut();
    vi.spyOn(sessionChallengeRepository, 'save').mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.execute(makeValidSutParams({ mfaRequired: true }));

    expect(promise).rejects.toThrow();
  });

  it('should store the session challenge to the database if authentication.initSignin right a success result', async () => {
    const { sut, sessionChallengeRepository } = makeSut();

    const result = await sut.execute(makeValidSutParams({ mfaRequired: true }));
    const hashedSession = getHash({ content: (result.value as InitSigninResult).session });

    expect(result.isRight()).toBe(true);
    expect(sessionChallengeRepository.sessionChallenges.length).toBeGreaterThan(0);
    expect(sessionChallengeRepository.sessionChallenges[0]).toEqual(
      expect.objectContaining({
        tenantCode: initialUser.tenants[0].code,
        userId: initialUser.id,
        sessionIdentifier: hashedSession,
        createdAt: expect.any(Date),
      }),
    );
  });
});
