import type { CreateIntegration } from '@/domain';
import { injectionTokens } from '@/main/di/injection-tokens';
import { type Controller, type HttpResponse, created, mapErrorsByCode } from '@solutions/core/api';
import { controllerErrorHandling, controllerValidationHandling } from '@solutions/core/main';
import { inject, injectable } from 'tsyringe';
import { z } from 'zod';
import { errorMapper } from '../helpers';

const { application } = injectionTokens;

const methodEnum = z.enum(['GET', 'POST', 'PUT', 'DELETE']);
const createIntegrationSchema = z.object({
  tenantCode: z.string(),
  name: z.string().min(1).max(128),
  code: z.string().min(1).max(128),
  description: z.string().min(1).max(256).optional(),
  sourceMethod: methodEnum,
  targetMethod: methodEnum,
  targetUrl: z.string().min(1).max(256),
});

type CreateIntegrationRequest = z.infer<typeof createIntegrationSchema>;

@injectable()
@controllerErrorHandling()
@controllerValidationHandling(createIntegrationSchema)
export class CreateIntegrationController implements Controller {
  constructor(@inject(application.createIntegration) private readonly createIntegration: CreateIntegration) {}

  handle = async (request: CreateIntegrationRequest): Promise<HttpResponse> => {
    const { tenantCode, name, code, description, sourceMethod, targetMethod, targetUrl } = request;

    const response = await this.createIntegration.execute({
      tenantCode,
      name,
      code,
      description,
      sourceMethod,
      targetMethod,
      targetUrl,
    });

    if (response.isLeft()) {
      return mapErrorsByCode(response.value, errorMapper);
    }

    return created();
  };
}
