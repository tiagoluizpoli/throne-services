import type { ConfirmForgotPassword, ConfirmForgotPasswordError, ConfirmForgotPasswordParams } from '@/domain';
import { injectionTokens } from '@/main/di';
import type { Authentication } from '@solutions/auth';
import { type Either, left, right } from '@solutions/core/domain';
import type { Logger } from '@solutions/logger';
import { inject, injectable } from 'tsyringe';
import { authenticationErrorMapper } from '../contracts';
const { global, infraestructure } = injectionTokens;

@injectable()
export class RemoteConfirmForgotPassword implements ConfirmForgotPassword {
  constructor(
    @inject(infraestructure.authentication) private readonly authentication: Authentication,
    @inject(global.logger) private readonly logger: Logger,
  ) {}

  execute = async (params: ConfirmForgotPasswordParams): Promise<Either<ConfirmForgotPasswordError, void>> => {
    const { username, confirmationCode, password } = params;

    this.logger.info('RemoteConfirmForgotPassword :: requesting confirm forgot password', {
      username,
      confirmationCode,
      password,
    });
    const confirmForgotPasswordResult = await this.authentication.confirmForgotPassword({
      username,
      confirmationCode,
      password,
    });

    if (confirmForgotPasswordResult.isLeft()) {
      this.logger.error('RemoteConfirmForgotPassword :: confirm forgot password failed', {
        errorCode: confirmForgotPasswordResult.value,
      });

      return left(authenticationErrorMapper[confirmForgotPasswordResult.value]);
    }

    this.logger.info('RemoteConfirmForgotPassword :: confirm forgot password successfuly called');

    return right(undefined);
  };
}
