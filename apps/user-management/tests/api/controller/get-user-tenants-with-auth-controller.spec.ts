import 'reflect-metadata';
import { GetUserTenantsWithAuthController } from '@/api';
import { DbGetUserTenantsWithAuth } from '@/application';
import {
  ForbiddenError,
  type GetUserTenantsWithAuth,
  NotAuthorizedError,
  PasswordResetRequiredError,
  TooManyRequestsError,
  UserNotConfirmedError,
  UserNotFoundError,
} from '@/domain';
import { faker } from '@faker-js/faker';
import { MockAuthentication } from '@solutions/auth';
import { UnexpectedError, left } from '@solutions/core/domain';
import { Logger } from '@solutions/logger';
import { InMemoryUsersRepository, type Tenant, type User, type UsersRepository } from '@solutions/shared-database';
import { mockUser } from '@solutions/shared-database/tests';

const initialUser = mockUser();

const makeValidSutParams = ({ mfaRequired }: { mfaRequired: boolean } = { mfaRequired: true }) => ({
  username: initialUser.email,
  password: faker.internet.password({ length: 10 }),
});

type SutParams = {
  initialUsers?: User[];
};

type SutTypes = {
  sut: GetUserTenantsWithAuthController;
  usersRepository: UsersRepository;
  signin: GetUserTenantsWithAuth;
};

const makeSut = ({ initialUsers = [] }: SutParams = {}): SutTypes => {
  const authentication = new MockAuthentication();
  const usersRepository = new InMemoryUsersRepository([initialUser, ...initialUsers]);
  const logger = new Logger({ level: 'error' });
  const signin = new DbGetUserTenantsWithAuth(authentication, usersRepository, logger);
  const sut = new GetUserTenantsWithAuthController(signin);

  return {
    sut,
    usersRepository,
    signin,
  };
};

describe('GetUserTenantsWithAuthController', () => {
  it('should return 200 with user.tenant list when the user exists and authentication returns a valid token', async () => {
    const { sut } = makeSut();

    const result = await sut.handle(makeValidSutParams());

    expect(result).toEqual({
      statusCode: 200,
      body: initialUser.tenants.map((t: Tenant) => ({
        code: t.code,
        name: t.name,
        description: t.description,
        createdAt: t.createdAt,
      })),
    });
    expect(result.body).not.toContain('apiKey');
    expect(result.body).not.toContain('availableUntil');
  });

  it('should return 400 when username is empty', async () => {
    const { sut } = makeSut();

    // @ts-expect-error: testing purpose
    const result = await sut.handle({ password: faker.internet.password({ length: 10 }) });

    expect(result.statusCode).toBe(400);
    expect(result.body.message).toBe('The received value for field "username" is invalid. Required');
  });

  it('should return 400 when username is an invalid email', async () => {
    const { sut } = makeSut();

    const result = await sut.handle({ username: 'invalid-email', password: faker.internet.password({ length: 10 }) });

    expect(result.statusCode).toBe(400);
    expect(result.body.message).toBe('The received value for field "username" is invalid. Invalid email');
  });

  it('should return 400 when password is empty', async () => {
    const { sut } = makeSut();

    // @ts-expect-error: testing purpose
    const result = await sut.handle({ username: initialUser.email });

    expect(result.statusCode).toBe(400);
    expect(result.body.message).toBe('The received value for field "password" is invalid. Required');
  });

  it('should return 400 when password has less than 8 characters', async () => {
    const { sut } = makeSut();

    const result = await sut.handle({ username: initialUser.email, password: faker.internet.password({ length: 7 }) });

    expect(result.statusCode).toBe(400);
    expect(result.body.message).toBe(
      'The received value for field "password" is invalid. String must contain at least 8 character(s)',
    );
  });

  it('should return 400 when getUserTenantsWithAuth.execute left a PasswordResetRequiredError', async () => {
    const { sut, signin } = makeSut();
    vi.spyOn(signin, 'execute').mockResolvedValueOnce(left(new PasswordResetRequiredError()));

    const result = await sut.handle(makeValidSutParams());

    expect(result.statusCode).toBe(400);
    expect(result.body.message).toBe('Reset password is required');
  });

  it('should return 401 when getUserTenantsWithAuth.execute left a ForbiddenError', async () => {
    const { sut, signin } = makeSut();
    vi.spyOn(signin, 'execute').mockResolvedValueOnce(left(new ForbiddenError()));

    const result = await sut.handle(makeValidSutParams());

    expect(result.statusCode).toBe(401);
    expect(result.body.message).toBe('Unauthorized');
  });

  it('should return 401 when getUserTenantsWithAuth.execute left a NotAuthorizedError', async () => {
    const { sut, signin } = makeSut();
    vi.spyOn(signin, 'execute').mockResolvedValueOnce(left(new NotAuthorizedError()));

    const result = await sut.handle(makeValidSutParams());

    expect(result.statusCode).toBe(401);
    expect(result.body.message).toBe('Unauthorized');
  });

  it('should return 401 when getUserTenantsWithAuth.execute left a UserNotConfirmedError', async () => {
    const { sut, signin } = makeSut();
    vi.spyOn(signin, 'execute').mockResolvedValueOnce(left(new UserNotConfirmedError()));

    const result = await sut.handle(makeValidSutParams());

    expect(result.statusCode).toBe(401);
    expect(result.body.message).toBe('Unauthorized');
  });

  it('should return 401 when getUserTenantsWithAuth.execute left a UserNotFoundError', async () => {
    const { sut, signin } = makeSut();
    vi.spyOn(signin, 'execute').mockResolvedValueOnce(left(new UserNotFoundError()));

    const result = await sut.handle(makeValidSutParams());

    expect(result.statusCode).toBe(401);
    expect(result.body.message).toBe('Unauthorized');
  });

  it('should return 429 when getUserTenantsWithAuth.execute left a TooManyRequestsError', async () => {
    const { sut, signin } = makeSut();
    vi.spyOn(signin, 'execute').mockResolvedValueOnce(left(new TooManyRequestsError()));

    const result = await sut.handle(makeValidSutParams());

    expect(result.statusCode).toBe(429);
  });
  it('should return 500 when getUserTenantsWithAuth.execute left a UnexpectedError', async () => {
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

  it('should return 500 when getUserTenantsWithAuth.execute throws', async () => {
    const { sut, signin } = makeSut();
    vi.spyOn(signin, 'execute').mockImplementationOnce(() => {
      throw new Error();
    });

    const result = await sut.handle(makeValidSutParams());

    expect(result.statusCode).toBe(500);
    expect(result.body.message).toBe('Internal server error');
  });
});
