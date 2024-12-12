import type { ForgotPassword } from '@/domain';
import { injectionTokens } from '@/main/di';
import { type Controller, type HttpResponse, mapErrorsByCode, ok } from '@solutions/core/api';
import { controllerErrorHandling, controllerValidationHandling } from '@solutions/core/main';
import { inject, injectable } from 'tsyringe';
import { z } from 'zod';
import { errorMapper } from '../helpers';

const { usecases } = injectionTokens;

const forgotPasswordSchema = z.object({
  username: z.string(),
});

export type ForgotPasswordRequest = z.infer<typeof forgotPasswordSchema>;

@injectable()
@controllerErrorHandling()
@controllerValidationHandling(forgotPasswordSchema)
export class ForgotPasswordController implements Controller {
  constructor(@inject(usecases.forgotPassword) private readonly forgotPassword: ForgotPassword) {}

  async handle(request: ForgotPasswordRequest): Promise<HttpResponse> {
    const { username } = request;

    const forgotPasswordResult = await this.forgotPassword.execute({ username });

    if (forgotPasswordResult.isLeft()) {
      return mapErrorsByCode(forgotPasswordResult.value, errorMapper);
    }

    return ok(forgotPasswordResult.value);
  }
}
