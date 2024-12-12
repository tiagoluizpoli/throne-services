import type { Either, UnexpectedError } from '@solutions/core/domain';
import type { Integration } from '../entities';
import type { IntegrationNotFoundError } from '../errors';

export interface GetIntegrationByIdParams {
  tenantCode: string;
  integrationId: string;
}

export type GetIntegrationByIdPossibleErrors = IntegrationNotFoundError | UnexpectedError;

export interface GetIntegrationById {
  execute: (params: GetIntegrationByIdParams) => Promise<Either<GetIntegrationByIdPossibleErrors, Integration>>;
}
