import {
  type GetUserTenantsWithAuth,
  type GetUserTenantsWithAuthError,
  type GetUserTenantsWithAuthParams,
  UserNotFoundError,
} from '@/domain';
import { injectionTokens } from '@/main/di';
import type { Authentication } from '@solutions/auth';
import { type Either, left, right } from '@solutions/core/domain';
import type { Logger } from '@solutions/logger';
import type { Tenant, UsersRepository } from '@solutions/shared-database';
import { inject, injectable } from 'tsyringe';
import { authenticationErrorMapper } from '../contracts';

const { global, infraestructure } = injectionTokens;

@injectable()
export class DbGetUserTenantsWithAuth implements GetUserTenantsWithAuth {
  constructor(
    @inject(infraestructure.authentication) private readonly authentication: Authentication,
    @inject(infraestructure.usersRepository) private readonly usersRepository: UsersRepository,
    @inject(global.logger) private readonly logger: Logger,
  ) {}

  execute = async ({
    username,
    password,
  }: GetUserTenantsWithAuthParams): Promise<Either<GetUserTenantsWithAuthError, Tenant[]>> => {
    // Fetch the user from the database
    const user = await this.usersRepository.getByEmail(username);

    if (!user) {
      this.logger.error('DbGetUserTenantsWithAuth.execute :: User not found in database', { username });
      return left(new UserNotFoundError());
    }

    // other validations

    // Authenticate the user against cognito
    const authResult = await this.authentication.signin({ email: username, password });

    if (authResult.isLeft()) {
      this.logger.error('DbGetUserTenantsWithAuth.execute :: Authentication failzed', { errorCode: authResult.value });
      return left(authenticationErrorMapper[authResult.value]);
    }

    return right(user.tenants);
  };
}
