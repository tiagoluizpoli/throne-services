import 'reflect-metadata';
import { SigninController } from '@/api';
import { RemoteSignin } from '@/application';
import {
  ForbiddenError,
  NotAuthorizedError,
  PasswordResetRequiredError,
  type Signin,
  TooManyRequestsError,
  UserHasMultipleTenantsError,
  UserNotConfirmedError,
  UserNotFoundError,
} from '@/domain';
import { faker } from '@faker-js/faker';
import { MockAuthentication } from '@solutions/auth';
import { UnexpectedError, left } from '@solutions/core/domain';
import { Logger } from '@solutions/logger';
import {
  InMemorySessionChallengeRepository,
  InMemorySessionRepository,
  InMemoryUsersRepository,
  type SessionChallengeRepository,
  type User,
  type UsersRepository,
} from '@solutions/shared-database';
import { mockUser } from '@solutions/shared-database/tests';
import type { SessionRepository } from '../../../../../packages/shared-database/src/repositories/contracts/repositories/session-repository';

const initialUser = mockUser();

const makeValidSutParams = ({ mfaRequired }: { mfaRequired: boolean } = { mfaRequired: true }) => ({
  username: initialUser.email,
  password: faker.internet.password({ length: 10 }),
  tenant: initialUser.tenants[0].code,
  mfaRequired,
});

type SutParams = {
  initialUsers?: User[];
};

type SutTypes = {
  sut: SigninController;
  usersRepository: UsersRepository;
  sessionRepository: SessionRepository;
  sessionChallengeRepository: SessionChallengeRepository;
  signin: Signin;
};

const makeSut = ({ initialUsers = [] }: SutParams = {}): SutTypes => {
  const authentication = new MockAuthentication();
  const usersRepository = new InMemoryUsersRepository([initialUser, ...initialUsers]);
  const sessionRepository = new InMemorySessionRepository();
  const sessionChallengeRepository = new InMemorySessionChallengeRepository();
  const logger = new Logger({ level: 'error' });
  const signin = new RemoteSignin(
    authentication,
    usersRepository,
    sessionRepository,
    sessionChallengeRepository,
    logger,
  );
  const sut = new SigninController(signin);

  return {
    sut,
    usersRepository,
    sessionRepository,
    sessionChallengeRepository,
    signin,
  };
};

describe('SigninController', () => {
  it('should return 200 with token when signin is successful with mfaRequired false', async () => {
    const { sut } = makeSut();

    const result = await sut.handle(makeValidSutParams({ mfaRequired: false }));

    expect(result).toEqual({
      statusCode: 200,
      body: {
        accessToken: expect.any(String),
        token: expect.any(String),
        refreshToken: expect.any(String),
      },
    });
  });

  it('should return 200 with challenge when signin is successful with mfaRequired true', async () => {
    const { sut } = makeSut();

    const result = await sut.handle(makeValidSutParams({ mfaRequired: true }));

    expect(result).toEqual({
      statusCode: 200,
      body: {
        challengeName: 'MFA',
        session: expect.any(String),
      },
    });
  });

  it('should return 400 when username is empty', async () => {
    const { sut } = makeSut();

    // @ts-expect-error: testing empty username
    const result = await sut.handle({
      password: faker.internet.password({ length: 10 }),
      tenant: faker.string.alpha({ length: 5 }),
    });

    expect(result.statusCode).toBe(400);
    expect(result.body.message).toBe('The received value for field "username" is invalid. Required');
  });

  it('should return 400 when username is an invalid email', async () => {
    const { sut } = makeSut();

    const result = await sut.handle({
      username: 'invalid-email',
      password: faker.internet.password({ length: 10 }),
      tenant: faker.string.alpha({ length: 5 }),
    });

    expect(result.statusCode).toBe(400);
    expect(result.body.message).toBe('The received value for field "username" is invalid. Invalid email');
  });

  it('should return 400 when password is empty', async () => {
    const { sut } = makeSut();

    // @ts-expect-error: testing empty password
    const result = await sut.handle({
      username: faker.internet.email(),
      tenant: faker.string.alpha({ length: 5 }),
    });

    expect(result.statusCode).toBe(400);
    expect(result.body.message).toBe('The received value for field "password" is invalid. Required');
  });

  it('should return 400 when password has less than 8 characters', async () => {
    const { sut } = makeSut();

    const result = await sut.handle({
      username: faker.internet.email(),
      password: faker.internet.password({ length: 7 }),
      tenant: faker.string.alpha({ length: 5 }),
    });

    expect(result.statusCode).toBe(400);
    expect(result.body.message).toBe(
      'The received value for field "password" is invalid. String must contain at least 8 character(s)',
    );
  });

  // it('should return 400 when tenant is empty', async () => {
  //   const { sut } = makeSut()

  //   // @ts-expect-error: testing empty tenant
  //   const result = await sut.handle({
  //     username: faker.internet.email(),
  //     password: faker.internet.password({ length: 10 }),
  //   })

  //   expect(result.statusCode).toBe(400)
  //   expect(result.body.message).toBe('The received value for field "tenant" is invalid. Required')
  // })

  it('should return 400 when signin.execute left a UserHasMultipleTenantsError', async () => {
    const { sut, signin } = makeSut();
    vi.spyOn(signin, 'execute').mockResolvedValueOnce(left(new UserHasMultipleTenantsError()));

    const result = await sut.handle(makeValidSutParams());

    expect(result.statusCode).toBe(400);
    expect(result.body.message).toBe('User has multiple tenants, please provide tenant code');
  });

  it('should return 400 when signin.execute left a PasswordResetRequiredError', async () => {
    const { sut, signin } = makeSut();
    vi.spyOn(signin, 'execute').mockResolvedValueOnce(left(new PasswordResetRequiredError()));

    const result = await sut.handle(makeValidSutParams());

    expect(result.statusCode).toBe(400);
    expect(result.body.message).toBe('Reset password is required');
  });

  it('should return 401 when signin.execute left a ForbiddenError', async () => {
    const { sut, signin } = makeSut();
    vi.spyOn(signin, 'execute').mockResolvedValueOnce(left(new ForbiddenError()));

    const result = await sut.handle(makeValidSutParams());

    expect(result.statusCode).toBe(401);
    expect(result.body.message).toBe('Unauthorized');
  });

  it('should return 401 when signin.execute left a UserNotConfirmedError', async () => {
    const { sut, signin } = makeSut();
    vi.spyOn(signin, 'execute').mockResolvedValueOnce(left(new UserNotConfirmedError()));

    const result = await sut.handle(makeValidSutParams());

    expect(result.statusCode).toBe(401);
    expect(result.body.message).toBe('Unauthorized');
  });

  it('should return 401 when signin.execute left a NotAuthorizedError', async () => {
    const { sut, signin } = makeSut();
    vi.spyOn(signin, 'execute').mockResolvedValueOnce(left(new NotAuthorizedError()));

    const result = await sut.handle(makeValidSutParams());

    expect(result.statusCode).toBe(401);
    expect(result.body.message).toBe('Unauthorized');
  });

  it('should return 401 when signin.execute left a UserNotFoundError', async () => {
    const { sut, signin } = makeSut();
    vi.spyOn(signin, 'execute').mockResolvedValueOnce(left(new UserNotFoundError()));

    const result = await sut.handle(makeValidSutParams());

    expect(result.statusCode).toBe(401);
    expect(result.body.message).toBe('Unauthorized');
  });

  it('should return 429 when signin.execute left a TooManyRequestsError', async () => {
    const { sut, signin } = makeSut();
    vi.spyOn(signin, 'execute').mockResolvedValueOnce(left(new TooManyRequestsError()));

    const result = await sut.handle(makeValidSutParams());

    expect(result.statusCode).toBe(429);
  });

  it('should return 500 when signin.execute left a UnexpectedError', async () => {
    const { sut, signin } = makeSut();
    vi.spyOn(signin, 'execute').mockResolvedValueOnce(left(new UnexpectedError()));

    const result = await sut.handle(makeValidSutParams());

    expect(result.statusCode).toBe(500);
    expect(result.body.message).toBe('Internal server error');
  });

  it('should return 500 when signin.execute left a unmapped error', async () => {
    const { sut, signin } = makeSut();
    // @ts-expect-error: testing unmapped error
    vi.spyOn(signin, 'execute').mockResolvedValueOnce(left(new Error()));

    const result = await sut.handle(makeValidSutParams());

    expect(result.statusCode).toBe(500);
    expect(result.body.message).toBe('Internal server error');
  });

  it('should return 500 when signin.execute throws', async () => {
    const { sut, signin } = makeSut();
    vi.spyOn(signin, 'execute').mockImplementationOnce(() => {
      throw new Error();
    });

    const result = await sut.handle(makeValidSutParams());

    expect(result.statusCode).toBe(500);
    expect(result.body.message).toBe('Internal server error');
  });
});
