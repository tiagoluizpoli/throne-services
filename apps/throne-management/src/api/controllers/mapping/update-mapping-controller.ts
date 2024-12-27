import { errorMapper } from '@/api/helpers';
import type { UpdateMapping } from '@/domain';
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
  sourceSchemaProps: z.object({
    id: z.string().uuid(),
    name: z.string().min(1).max(128),
    schema: z.object({}).passthrough(),
  }),
  targetSchemaProps: z.object({
    id: z.string().uuid(),
    name: z.string().min(1).max(128),
    schema: z.object({}).passthrough(),
  }),
});

type UpdateMappingRequest = z.infer<typeof updateMappingSchema>;

@injectable()
@controllerErrorHandling()
@controllerValidationHandling(updateMappingSchema)
export class UpdateMappingController implements Controller {
  constructor(@inject(application.updateMapping) private readonly updateMapping: UpdateMapping) {}

  async handle(request: UpdateMappingRequest): Promise<HttpResponse> {
    const { tenantCode, integrationId, mappingId, sourceSchemaProps, targetSchemaProps } = request;

    const result = await this.updateMapping.execute({
      id: mappingId,
      tenantCode,
      integrationId,
      sourceSchemaProps,
      targetSchemaProps,
    });

    if (result.isLeft()) {
      return mapErrorsByCode(result.value, errorMapper);
    }

    return noContent();
  }
}
