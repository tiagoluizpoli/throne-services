import { errorMapper } from '@/api/helpers';
import type { GetUser } from '@/domain';
import { injectionTokens } from '@/main/di';
import { type Controller, type HttpResponse, mapErrorsByCode, ok } from '@solutions/core/api';
import { controllerErrorHandling, controllerValidationHandling } from '@solutions/core/main';
import { inject, injectable } from 'tsyringe';
import { z } from 'zod';

const { usecases } = injectionTokens;

export const getUserSchema = z.object({
  userId: z.string().optional(),
  tenant: z.string().optional(),
  externalUserId: z.string().optional(),
});

export type GetUserRequest = z.infer<typeof getUserSchema>;

@injectable()
@controllerErrorHandling()
@controllerValidationHandling(getUserSchema)
export class GetUserController implements Controller {
  constructor(@inject(usecases.getUser) private readonly getUser: GetUser) {}

  async handle(request: GetUserRequest): Promise<HttpResponse> {
    const { tenant, userId, externalUserId } = request;
    console.log('GetUserController', { request, tenant, userId, externalUserId });

    const getUserResult = await this.getUser.execute({
      email: userId!,
      tenant: tenant!,
      username: externalUserId!,
    });

    if (getUserResult.isLeft()) {
      return mapErrorsByCode(getUserResult.value, errorMapper);
    }

    return ok(getUserResult.value);
  }
}
