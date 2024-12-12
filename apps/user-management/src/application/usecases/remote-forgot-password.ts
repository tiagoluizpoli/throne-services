import type { ConfirmForgotPasswordError, ForgotPassword, ForgotPasswordParams, ForgotPasswordResult } from '@/domain';
import { injectionTokens } from '@/main/di';
import type { Authentication } from '@solutions/auth';
import { type Either, left, right } from '@solutions/core/domain';
import type { Logger } from '@solutions/logger';
import { inject, injectable } from 'tsyringe';
import { authenticationErrorMapper } from '../contracts';
const { global, infraestructure } = injectionTokens;

@injectable()
export class RemoteForgotPassword implements ForgotPassword {
  constructor(
    @inject(infraestructure.authentication) private readonly authentication: Authentication,
    @inject(global.logger) private readonly logger: Logger,
  ) {}

  execute = async (params: ForgotPasswordParams): Promise<Either<ConfirmForgotPasswordError, ForgotPasswordResult>> => {
    const { username } = params;

    this.logger.info('RemoteForgotPassword :: requesting forgot password', { username });
    const forgotPasswordResult = await this.authentication.forgotPassword({
      username,
    });

    if (forgotPasswordResult.isLeft()) {
      this.logger.error('RemoteForgotPassword :: forgot password failed', {
        errorCode: forgotPasswordResult.value,
      });

      return left(authenticationErrorMapper[forgotPasswordResult.value]);
    }

    const { attributeName, deliveryType, destination } = forgotPasswordResult.value;

    this.logger.info('RemoteForgotPassword :: forgot password successfuly called', {
      attributeName: attributeName,
      deliveryType: deliveryType,
      destination: destination,
    });

    return right({
      attributeName,
      destination,
    });
  };
}
