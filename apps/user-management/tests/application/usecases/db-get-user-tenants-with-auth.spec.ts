import 'reflect-metadata';
import '@/main/di/register-injections';
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
import { type Authentication, MockAuthentication } from '@solutions/auth';
import { UnexpectedError, left } from '@solutions/core/domain';
import type { Logger } from '@solutions/logger';
import { InMemoryUsersRepository, type User, type UsersRepository } from '@solutions/shared-database';
import { mockUser } from '@solutions/shared-database/tests';
import { container } from 'tsyringe';

const initialUser = mockUser();

const makeRandomSutParams = () => ({
  username: faker.internet.email(),
  password: faker.internet.password({ length: 10 }),
});

const makeValidSutParams = () => ({
  username: initialUser.email,
  password: faker.internet.password({ length: 10 }),
});

type SutParams = {
  initialUsers?: User[];
};

type SutTypes = {
  sut: GetUserTenantsWithAuth;
  authentication: Authentication;
  usersRepository: UsersRepository;
};

const makeSut = ({ initialUsers = [] }: SutParams = {}): SutTypes => {
  const usersRepository = new InMemoryUsersRepository([initialUser, ...initialUsers]);
  const authentication = new MockAuthentication();

  const sut = new DbGetUserTenantsWithAuth(authentication, usersRepository, container.resolve<Logger>('Logger'));

  return { sut, authentication, usersRepository };
};

describe('DbGetUserTenantsWithAuth', () => {
  it('should left userNotFoundError when the user does not exist', async () => {
    const { sut } = makeSut();

    const result = await sut.execute(makeRandomSutParams());

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });
  it('should throw if UsersRepository getByEmail throws', async () => {
    const { sut, usersRepository } = makeSut();
    vi.spyOn(usersRepository, 'getByEmail').mockImplementationOnce(() => {
      throw new Error();
    });

    const result = sut.execute(makeRandomSutParams());

    await expect(result).rejects.toThrow();
  });

  it('should left ForbiddenError when authentication returns ForbiddenException', async () => {
    const { sut, authentication } = makeSut();
    vi.spyOn(authentication, 'signin').mockResolvedValueOnce(left('ForbiddenException'));

    const result = await sut.execute(makeValidSutParams());

    expect(result).toEqual(left(new ForbiddenError()));
  });

  it('should left NotAuthorizedError when authentication returns NotAuthorizedException', async () => {
    const { sut, authentication } = makeSut();
    vi.spyOn(authentication, 'signin').mockResolvedValueOnce(left('NotAuthorizedException'));

    const result = await sut.execute(makeValidSutParams());

    expect(result).toEqual(left(new NotAuthorizedError()));
  });

  it('should left PasswordResetRequiredError when authentication returns PasswordResetRequiredException', async () => {
    const { sut, authentication } = makeSut();
    vi.spyOn(authentication, 'signin').mockResolvedValueOnce(left('PasswordResetRequiredException'));

    const result = await sut.execute(makeValidSutParams());

    expect(result).toEqual(left(new PasswordResetRequiredError()));
  });

  it('should left TooManyRequestsError when authentication returns TooManyRequestsException', async () => {
    const { sut, authentication } = makeSut();
    vi.spyOn(authentication, 'signin').mockResolvedValueOnce(left('TooManyRequestsException'));

    const result = await sut.execute(makeValidSutParams());

    expect(result).toEqual(left(new TooManyRequestsError()));
  });

  it('should left UserNotConfirmedError when authentication returns UserNotConfirmedException', async () => {
    const { sut, authentication } = makeSut();

    vi.spyOn(authentication, 'signin').mockResolvedValueOnce(left('UserNotConfirmedException'));

    const result = await sut.execute(makeValidSutParams());

    expect(result).toEqual(left(new UserNotConfirmedError()));
  });

  it('should left UserNotFoundError when authentication returns UserNotFoundException', async () => {
    const { sut, authentication } = makeSut();
    vi.spyOn(authentication, 'signin').mockResolvedValueOnce(left('UserNotFoundException'));

    const result = await sut.execute(makeValidSutParams());

    expect(result).toEqual(left(new UserNotFoundError()));
  });

  it('should left UnexpectedError when authentication returns UnexpectedException', async () => {
    const { sut, authentication } = makeSut();
    vi.spyOn(authentication, 'signin').mockResolvedValueOnce(left('UnexpectedException'));

    const result = await sut.execute(makeValidSutParams());

    expect(result).toEqual(left(new UnexpectedError()));
  });

  it('should throw when authentication throws', async () => {
    const { sut, authentication } = makeSut();
    vi.spyOn(authentication, 'signin').mockImplementationOnce(() => {
      throw new Error();
    });

    const result = sut.execute(makeValidSutParams());

    await expect(result).rejects.toThrow();
  });

  it('should right a user.tenant list when the user exists and authentication returns a valid token', async () => {
    const { sut } = makeSut();

    const result = await sut.execute(makeValidSutParams());

    //Assert
    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(initialUser.tenants);
  });
});
