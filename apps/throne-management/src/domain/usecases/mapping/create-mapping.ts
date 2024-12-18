import type { MappingType } from '@/domain/entities';
import type { IntegrationNotFoundError, MappingAlreadyExistsError } from '@/domain/errors';
import type { Either, UnexpectedError } from '@solutions/core/domain';

export interface CreateMappingSchema {
  name: string;
  schema: object;
}

export interface CreateMappingParams {
  tenantCode: string;
  integrationId: string;
  type: MappingType;
  sourceSchemaProps: CreateMappingSchema;
  targetSchemaProps: CreateMappingSchema;
}

export type CreateMappingPossibleErrors = IntegrationNotFoundError | MappingAlreadyExistsError | UnexpectedError;

export interface CreateMapping {
  execute: (params: CreateMappingParams) => Promise<Either<CreateMappingPossibleErrors, void>>;
}
