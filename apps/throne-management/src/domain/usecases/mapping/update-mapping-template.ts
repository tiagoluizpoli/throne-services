import type { IntegrationNotFoundError, MappingNotFoundError } from '@/domain/errors';
import type { Either, UnexpectedError } from '@solutions/core/domain';

export interface UpdateMappingTemplateParams {
  tenantCode: string;
  integrationId: string;
  id: string;
  mappingTemplate: object;
}

export type UpdateMappingTemplatePossibleErrors = IntegrationNotFoundError | MappingNotFoundError | UnexpectedError;

export interface UpdateMappingTemplate {
  execute: (params: UpdateMappingTemplateParams) => Promise<Either<UpdateMappingTemplatePossibleErrors, void>>;
}
