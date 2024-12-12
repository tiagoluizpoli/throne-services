import type { UpdateIntegration } from '@/domain';
import { injectionTokens } from '@/main/di/injection-tokens';
import { type Controller, type HttpResponse, mapErrorsByCode, ok } from '@solutions/core/api';
import { controllerErrorHandling, controllerValidationHandling } from '@solutions/core/main';
import { inject, injectable } from 'tsyringe';
import { z } from 'zod';
import { errorMapper } from '../helpers';
const { application } = injectionTokens;

const methodEnum = z.enum(['GET', 'POST', 'PUT', 'DELETE']);

const updateIntegrationSchema = z.object({
  integrationId: z.string().uuid(),
  tenantCode: z.string(),
  name: z.string().min(1).max(128),
  code: z.string().min(1).max(128),
  description: z.string().min(1).max(256),
  sourceMethod: methodEnum,
  targetMethod: methodEnum,
  targetUrl: z.string().min(1).max(256),
});

type UpdateIntegrationRequest = z.infer<typeof updateIntegrationSchema>;

@injectable()
@controllerErrorHandling()
@controllerValidationHandling(updateIntegrationSchema)
export class UpdateIntegrationController implements Controller {
  constructor(@inject(application.updateIntegration) private readonly updateIntegration: UpdateIntegration) {}

  async handle(request: UpdateIntegrationRequest): Promise<HttpResponse> {
    const { tenantCode, integrationId, code, name, description, sourceMethod, targetMethod, targetUrl } = request;

    const response = await this.updateIntegration.execute({
      tenantCode,
      id: integrationId,
      code,
      name,
      description,
      sourceMethod,
      targetMethod,
      targetUrl,
    });

    if (response.isLeft()) {
      return mapErrorsByCode(response.value, errorMapper);
    }

    return ok();
  }
}
