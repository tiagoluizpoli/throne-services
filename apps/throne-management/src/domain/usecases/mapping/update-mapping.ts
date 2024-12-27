import type { IntegrationNotFoundError, MappingNotFoundError } from '@/domain/errors';
import type { Either, UnexpectedError } from '@solutions/core/domain';

export interface UpdateMappingSchema {
  id: string;
  name: string;
  schema: object;
}

export interface UpdateMappingParams {
  tenantCode: string;
  integrationId: string;
  id: string;
  sourceSchemaProps: UpdateMappingSchema;
  targetSchemaProps: UpdateMappingSchema;
}

export type UpdateMappingPossibleErrors = IntegrationNotFoundError | MappingNotFoundError | UnexpectedError;

export interface UpdateMapping {
  execute: (params: UpdateMappingParams) => Promise<Either<UpdateMappingPossibleErrors, void>>;
}
