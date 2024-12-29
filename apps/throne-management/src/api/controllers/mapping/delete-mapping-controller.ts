import { errorMapper } from '@/api/helpers';
import type { DeleteMapping } from '@/domain';
import { injectionTokens } from '@/main/di';
import { type Controller, type HttpResponse, mapErrorsByCode, noContent } from '@solutions/core/api';
import { controllerErrorHandling, controllerValidationHandling } from '@solutions/core/main';
import { inject, injectable } from 'tsyringe';
import { z } from 'zod';

const { application } = injectionTokens;

const updateMappingSchema = z.object({
  tenantCode: z.string(),
  integrationId: z.string().uuid(),
  mappingId: z.string().uuid(),
});

type UpdateMappingRequest = z.infer<typeof updateMappingSchema>;

@injectable()
@controllerErrorHandling()
@controllerValidationHandling(updateMappingSchema)
export class DeleteMappingController implements Controller {
  constructor(@inject(application.deleteMapping) private readonly deleteMapping: DeleteMapping) {}

  async handle(request: UpdateMappingRequest): Promise<HttpResponse> {
    const { tenantCode, integrationId, mappingId } = request;

    const result = await this.deleteMapping.execute({
      tenantCode,
      integrationId,
      id: mappingId,
    });

    if (result.isLeft()) {
      return mapErrorsByCode(result.value, errorMapper);
    }

    return noContent();
  }
}
