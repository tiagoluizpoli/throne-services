import type { Signout } from '@/domain';
import { injectionTokens } from '@/main/di';
import { type Controller, type HttpResponse, mapErrorsByCode, noContent } from '@solutions/core/api';
import { controllerErrorHandling, controllerValidationHandling } from '@solutions/core/main';
import { inject, injectable } from 'tsyringe';
import { z } from 'zod';
import { errorMapper } from '../helpers';

const { usecases } = injectionTokens;

const signoutSchema = z.object({
  accessToken: z.string(),
});

export type SignoutRequest = z.TypeOf<typeof signoutSchema>;

@injectable()
@controllerErrorHandling()
@controllerValidationHandling(signoutSchema)
export class SignoutController implements Controller {
  constructor(@inject(usecases.signout) private readonly signout: Signout) {}

  async handle(request: SignoutRequest): Promise<HttpResponse> {
    const { accessToken } = request;

    const signoutResult = await this.signout.execute({ accessToken });

    if (signoutResult.isLeft()) {
      return mapErrorsByCode(signoutResult.value, errorMapper);
    }

    return noContent();
  }
}
