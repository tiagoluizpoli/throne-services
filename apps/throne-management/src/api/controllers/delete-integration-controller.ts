import type { DeleteIntegration } from '@/domain';
import { injectionTokens } from '@/main/di/injection-tokens';
import { type Controller, type HttpResponse, mapErrorsByCode, ok } from '@solutions/core/api';
import { controllerErrorHandling, controllerValidationHandling } from '@solutions/core/main';
import { inject, injectable } from 'tsyringe';
import { z } from 'zod';
import { errorMapper } from '../helpers';

const { application } = injectionTokens;

const deleteIntegrationSchema = z.object({
  tenantCode: z.string(),
  integrationId: z.string().uuid(),
});

type DeleteIntegrationRequest = z.infer<typeof deleteIntegrationSchema>;

@injectable()
@controllerErrorHandling()
@controllerValidationHandling(deleteIntegrationSchema)
export class DeleteIntegrationController implements Controller {
  constructor(@inject(application.deleteIntegration) private readonly deleteIntegration: DeleteIntegration) {}

  async handle(request: DeleteIntegrationRequest): Promise<HttpResponse> {
    const { integrationId, tenantCode } = request;

    const response = await this.deleteIntegration.execute({ tenantCode, id: integrationId });

    if (response.isLeft()) {
      return mapErrorsByCode(response.value, errorMapper);
    }

    return ok();
  }
}
