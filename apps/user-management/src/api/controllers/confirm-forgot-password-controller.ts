import type { ConfirmForgotPassword } from '@/domain';
import { injectionTokens } from '@/main/di';
import { type Controller, type HttpResponse, mapErrorsByCode, noContent } from '@solutions/core/api';
import { controllerErrorHandling, controllerValidationHandling } from '@solutions/core/main';
import { inject, injectable } from 'tsyringe';
import { z } from 'zod';
import { errorMapper } from '../helpers';

const { usecases } = injectionTokens;

const confirmForgotPasswordSchema = z.object({
  username: z.string(),
  confirmationCode: z
    .string()
    .min(6, 'Confirmation code must be 6 characters long')
    .max(6, 'Confirmation code must be 6 characters long'),
  password: z.string(),
});

export type ConfirmForgotPasswordRequest = z.infer<typeof confirmForgotPasswordSchema>;

@injectable()
@controllerErrorHandling()
@controllerValidationHandling(confirmForgotPasswordSchema)
export class ConfirmForgotPasswordController implements Controller {
  constructor(@inject(usecases.confirmForgotPassword) private readonly confirmForgotPassword: ConfirmForgotPassword) {}

  async handle(request: ConfirmForgotPasswordRequest): Promise<HttpResponse> {
    const { username, password, confirmationCode } = request;

    const confirmForgotPasswordResult = await this.confirmForgotPassword.execute({
      username,
      password,
      confirmationCode,
    });

    if (confirmForgotPasswordResult.isLeft()) {
      return mapErrorsByCode(confirmForgotPasswordResult.value, errorMapper);
    }

    return noContent();
  }
}
