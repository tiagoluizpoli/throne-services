import type { Signout, SignoutError, SignoutParams } from '@/domain'
import { injectionTokens } from '@/main/di'
import type { Authentication } from '@solutions/auth'
import { type Either, left, right } from '@solutions/core/domain'
import type { Logger } from '@solutions/logger'
import { inject, injectable } from 'tsyringe'
import { authenticationErrorMapper } from '../contracts'
const { infraestructure, global } = injectionTokens

@injectable()
export class RemoteSignout implements Signout {
  constructor(
    @inject(infraestructure.authentication) private readonly authentication: Authentication,
    @inject(global.logger) private readonly logger: Logger,
  ) {}

  execute = async (params: SignoutParams): Promise<Either<SignoutError, void>> => {
    const { accessToken } = params

    this.logger.info('RemoteSignout :: Starting signout')
    const signoutResult = await this.authentication.signout({ accessToken })

    if (signoutResult.isLeft()) {
      this.logger.error('RemoteSignout :: signout failed', { errorCode: signoutResult.value })
      return left(authenticationErrorMapper[signoutResult.value])
    }

    this.logger.info('RemoteSignout :: Signout successful')

    return right(undefined)
  }
}
