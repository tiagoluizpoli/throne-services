import { errorMapper } from '@/api/helpers';
import type { UpdateMappingTemplate } from '@/domain';
import { injectionTokens } from '@/main/di';
import { type Controller, type HttpResponse, mapErrorsByCode, noContent } from '@solutions/core/api';
import { controllerErrorHandling, controllerValidationHandling } from '@solutions/core/main';
import { inject, injectable } from 'tsyringe';
import { z } from 'zod';

const { application } = injectionTokens;

const updateMappingTemplateSchema = z.object({
  tenantCode: z.string(),
  integrationId: z.string().uuid(),
  mappingId: z.string().uuid(),
  mappingTemplate: z.object({}).passthrough(),
});

type UpdateMappingTemplateRequest = z.infer<typeof updateMappingTemplateSchema>;

@injectable()
@controllerErrorHandling()
@controllerValidationHandling(updateMappingTemplateSchema)
export class UpdateMappingTemplateController implements Controller {
  constructor(
    @inject(application.updateMappingTemplate) private readonly updateMappingTemplate: UpdateMappingTemplate,
  ) {}
  async handle(request: UpdateMappingTemplateRequest): Promise<HttpResponse> {
    const { tenantCode, integrationId, mappingId, mappingTemplate } = request;

    const result = await this.updateMappingTemplate.execute({
      tenantCode,
      integrationId,
      id: mappingId,
      mappingTemplate,
    });

    if (result.isLeft()) {
      return mapErrorsByCode(result.value, errorMapper);
    }

    return noContent();
  }
}
