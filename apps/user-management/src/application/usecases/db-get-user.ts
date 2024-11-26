import { type GetUser, type GetUserError, type GetUserParams, type GetUserResult, UserNotFoundError } from '@/domain'
import { injectionTokens } from '@/main/di'
import type { Authentication } from '@solutions/auth'
import { type Either, left, right } from '@solutions/core/domain'
import type { Logger } from '@solutions/logger'
import type { UsersRepository } from '@solutions/shared-database'
import { inject, injectable } from 'tsyringe'
import { authenticationErrorMapper } from '../contracts'

const { infraestructure, global } = injectionTokens

@injectable()
export class DbGetUser implements GetUser {
  constructor(
    @inject(infraestructure.usersRepository) private readonly usersRepository: UsersRepository,
    @inject(infraestructure.authentication) private readonly authentication: Authentication,
    @inject(global.logger) private readonly logger: Logger,
  ) {}
  async execute(params: GetUserParams): Promise<Either<GetUserError, GetUserResult>> {
    const { tenant, email, username } = params

    this.logger.info('DbGetUser.execute :: fetching user from database', { email })
    const dbUser = await this.usersRepository.getByEmail(email)

    if (!dbUser) {
      this.logger.error('DbGetUser.execute :: User not found in database', { email })
      return left(new UserNotFoundError())
    }

    this.logger.info('DbGetUser.execute :: fetching user from external authentication service', { username })

    const externalUserResult = await this.authentication.getUser({ username })
    if (externalUserResult.isLeft()) {
      this.logger.error('DbGetUser.execute :: failed to fetch user from external authentication service', {
        errorCode: externalUserResult.value,
      })

      return left(authenticationErrorMapper[externalUserResult.value])
    }

    const externalUser = externalUserResult.value
    const currentTenant = dbUser.tenants.find((t) => t.code === tenant)!

    const userData: GetUserResult = {
      email: dbUser.email,
      createdAt: externalUser.createdAt,
      services: externalUser.groups,
      currentTenant: {
        code: currentTenant.code,
        name: currentTenant.name,
      },
      tenants: dbUser.tenants.map((tenant) => ({
        code: tenant.code,
        name: tenant.name,
      })),
      status: externalUser.status,
    }

    this.logger.info('DbGetUser.execute :: returning user data')
    this.logger.debug('DbGetUser.execute :: returning user data', {
      userData: JSON.stringify(userData, null, 2),
      dbUser: JSON.stringify(dbUser, null, 2),
      externalUser: JSON.stringify(externalUser, null, 2),
    })

    return right(userData)
  }
}
