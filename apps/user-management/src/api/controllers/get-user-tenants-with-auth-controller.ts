import { errorMapper } from '@/api/helpers';

import type { GetUserTenantsWithAuth } from '@/domain';
import { injectionTokens } from '@/main/di';
import { type Controller, type HttpResponse, mapErrorsByCode, ok } from '@solutions/core/api';
import { controllerErrorHandling, controllerValidationHandling } from '@solutions/core/main';
import type { Tenant } from '@solutions/shared-database';
import { inject, injectable } from 'tsyringe';
import { z } from 'zod';

const { usecases } = injectionTokens;

export const getUserTenantsWithAuthSchema = z.object({
  username: z.string().email(),
  password: z.string().min(8),
});

export type GetUserTenantsWithAuthRequest = z.infer<typeof getUserTenantsWithAuthSchema>;

@injectable()
@controllerErrorHandling()
@controllerValidationHandling(getUserTenantsWithAuthSchema)
export class GetUserTenantsWithAuthController implements Controller {
  constructor(
    @inject(usecases.getUserTenantsWithAuth)
    private readonly getUserTenantsWithAuth: GetUserTenantsWithAuth,
  ) {}

  async handle(request: GetUserTenantsWithAuthRequest): Promise<HttpResponse> {
    const { username, password } = request;

    const getTenantsFromUserResult = await this.getUserTenantsWithAuth.execute({
      username,
      password,
    });

    if (getTenantsFromUserResult.isLeft()) {
      return mapErrorsByCode(getTenantsFromUserResult.value, errorMapper);
    }

    const tenants = getTenantsFromUserResult.value;

    const response = tenants.map((tenant: Tenant) => ({
      code: tenant.code,
      name: tenant.name,
      description: tenant.description,
      createdAt: tenant.createdAt,
    }));

    return ok(response);
  }
}
