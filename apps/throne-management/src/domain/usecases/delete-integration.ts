import type { Either, UnexpectedError } from '@solutions/core/domain';
import type { IntegrationNotFoundError } from '../errors';

export interface DeleteIntegrationParams {
  tenantCode: string;
  id: string;
}

export type DeleteIntegrationPossibleErrors = IntegrationNotFoundError | UnexpectedError;

export interface DeleteIntegration {
  execute: (params: DeleteIntegrationParams) => Promise<Either<DeleteIntegrationPossibleErrors, void>>;
}
