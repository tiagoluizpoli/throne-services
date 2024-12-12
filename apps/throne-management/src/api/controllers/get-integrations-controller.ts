import type { GetIntegrations } from '@/domain';
import { injectionTokens } from '@/main/di';
import { type Controller, type HttpResponse, mapErrorsByCode, ok } from '@solutions/core/api';
import { controllerErrorHandling, controllerValidationHandling } from '@solutions/core/main';
import { inject, injectable } from 'tsyringe';
import { z } from 'zod';
import { errorMapper } from '../helpers';

const { application } = injectionTokens;

const getIntegrationSchema = z.object({
  tenantCode: z.string(),
  search: z.string().min(1).max(128).optional(),
  pageIndex: z.coerce.number().min(0).max(100).default(0),
  pageSize: z.coerce.number().min(1).max(100).default(25),
  orderBy: z.enum(['createdAt']).default('createdAt'),
  orderDirection: z.enum(['asc', 'desc']).default('desc'),
});

type GetIntegrationsRequest = z.infer<typeof getIntegrationSchema>;

@injectable()
@controllerErrorHandling()
@controllerValidationHandling(getIntegrationSchema)
export class GetIntegrationsController implements Controller {
  constructor(@inject(application.getIntegrations) private readonly getIntegrations: GetIntegrations) {}

  async handle(request: GetIntegrationsRequest): Promise<HttpResponse> {
    const { tenantCode, search, pageIndex, pageSize, orderBy, orderDirection } = request;

    const result = await this.getIntegrations.execute({
      tenantCode,
      search,
      pageIndex,
      pageSize,
      orderBy,
      orderDirection,
    });

    if (result.isLeft()) {
      return mapErrorsByCode(result.value, errorMapper);
    }

    const { total, items } = result.value;

    return ok({
      total,
      items: items.map((item) => ({
        id: item.id,
        code: item.code,
        name: item.name,
        createdAt: item.createdAt,
      })),
    });
  }
}
