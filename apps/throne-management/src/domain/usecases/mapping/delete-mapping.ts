import type { IntegrationNotFoundError, MappingNotFoundError } from '@/domain/errors';
import type { Either, UnexpectedError } from '@solutions/core/domain';

export interface DeleteMappingParams {
  tenantCode: string;
  integrationId: string;
  id: string;
}

export type DeleteMappingPossibleErrors = IntegrationNotFoundError | MappingNotFoundError | UnexpectedError;

export interface DeleteMapping {
  execute: (params: DeleteMappingParams) => Promise<Either<DeleteMappingPossibleErrors, void>>;
}
