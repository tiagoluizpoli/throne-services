import type { Either, UnexpectedError } from '@solutions/core/domain';
import type { GetAllParams, GetAllResult } from '@solutions/core/domain/usecases';
import type { Integration } from '../entities';

export interface GetIntegrationsParams extends GetAllParams {}

export interface GetIntegrationsResult extends GetAllResult<Integration> {}

export type GetIntegrationsPossibleErrors = UnexpectedError;

export interface GetIntegrations {
  execute: (params: GetIntegrationsParams) => Promise<Either<GetIntegrationsPossibleErrors, GetIntegrationsResult>>;
}
