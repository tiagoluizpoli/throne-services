import { errorMapper } from '@/api/helpers';
import type { CreateMapping } from '@/domain';
import { injectionTokens } from '@/main/di';
import { type Controller, type HttpResponse, created, mapErrorsByCode } from '@solutions/core/api';
import { controllerErrorHandling, controllerValidationHandling } from '@solutions/core/main';
import { inject, injectable } from 'tsyringe';
import { z } from 'zod';

const { application } = injectionTokens;

const reateMappingSchema = z.object({
  tenantCode: z.string(),
  integrationId: z.string().uuid(),
  type: z.enum(['input', 'output']),
  sourceSchemaProps: z.object({
    name: z.string().min(1).max(128),
    schema: z.object({}).passthrough(),
  }),
  targetSchemaProps: z.object({
    name: z.string().min(1).max(128),
    schema: z.object({}).passthrough(),
  }),
});

type CreateMappingRequest = z.infer<typeof reateMappingSchema>;

@injectable()
@controllerErrorHandling()
@controllerValidationHandling(reateMappingSchema)
export class CreateMappingController implements Controller {
  constructor(@inject(application.createMapping) private readonly createMapping: CreateMapping) {}

  async handle(request: CreateMappingRequest): Promise<HttpResponse> {
    const { tenantCode, integrationId, type, sourceSchemaProps, targetSchemaProps } = request;

    const result = await this.createMapping.execute({
      tenantCode,
      type,
      integrationId,
      sourceSchemaProps,
      targetSchemaProps,
    });

    if (result.isLeft()) {
      return mapErrorsByCode(result.value, errorMapper);
    }

    return created();
  }
}
