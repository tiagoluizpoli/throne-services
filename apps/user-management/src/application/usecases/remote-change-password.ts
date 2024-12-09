import type { ChangePassword, ChangePasswordError, ChangePasswordParams } from '@/domain'
import { injectionTokens } from '@/main/di'
import type { Authentication } from '@solutions/auth'
import { type Either, left, right } from '@solutions/core/domain'
import type { Logger } from '@solutions/logger'
import { inject, injectable } from 'tsyringe'
import { authenticationErrorMapper } from '../contracts'

const { infraestructure, global } = injectionTokens

@injectable()
export class RemoteChangePassword implements ChangePassword {
  constructor(
    @inject(infraestructure.authentication) private readonly authentication: Authentication,
    @inject(global.logger) private readonly logger: Logger,
  ) {}

  execute = async (params: ChangePasswordParams): Promise<Either<ChangePasswordError, void>> => {
    const { accessToken, previousPassword, newPassword } = params

    this.logger.info('RemoteChangePassword.execute :: Changing password')

    const changePassword = await this.authentication.changePassword({
      accessToken,
      previousPassword,
      proposedPassword: newPassword,
    })

    if (changePassword.isLeft()) {
      this.logger.error('RemoteChangePassword.execute :: Failed to change password', {
        errorCode: changePassword.value,
      })
      return left(authenticationErrorMapper[changePassword.value])
    }

    return right(undefined)
  }
}
