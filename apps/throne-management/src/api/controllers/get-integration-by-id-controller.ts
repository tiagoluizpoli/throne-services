import type { GetIntegrationById } from '@/domain';
import { injectionTokens } from '@/main/di';
import { type Controller, type HttpResponse, mapErrorsByCode, ok } from '@solutions/core/api';
import { controllerErrorHandling, controllerValidationHandling } from '@solutions/core/main';
import { inject, injectable } from 'tsyringe';
import { z } from 'zod';
import { errorMapper } from '../helpers';

const { application } = injectionTokens;

const GetIntegratonByIdSchema = z.object({
  tenantCode: z.string(),
  integrationId: z.string().uuid(),
});

type GetIntegratonByIdSchema = z.infer<typeof GetIntegratonByIdSchema>;

@injectable()
@controllerErrorHandling()
@controllerValidationHandling(GetIntegratonByIdSchema)
export class GetIntegrationByIdController implements Controller {
  constructor(@inject(application.getIntegrationById) private readonly getIntegrationById: GetIntegrationById) {}

  async handle(request: GetIntegratonByIdSchema): Promise<HttpResponse> {
    const { tenantCode, integrationId } = request;

    const result = await this.getIntegrationById.execute({ tenantCode, integrationId });

    if (result.isLeft()) {
      return mapErrorsByCode(result.value, errorMapper);
    }

    const integration = result.value;

    const response = {
      id: integration.id,
      code: integration.code,
      name: integration.name,
      sourceMethod: integration.sourceMethod,
      targetMethod: integration.targetMethod,
      targetUrl: integration.targetUrl,
      uniqueCode: integration.uniqueCode,
      description: integration.description,
      createdAt: integration.createdAt,
    };
    return ok(response);
  }
}
