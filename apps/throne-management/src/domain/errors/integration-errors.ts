import type { UseCaseError } from '@solutions/core/domain';

export class IntegrationAlreadyExistsError extends Error implements UseCaseError {
  constructor() {
    super('Integration already exists');
    this.name = 'IntegrationAlreadyExistsError';
    this.code = 'INTEGRATION_ALREADY_EXISTS_ERROR';
  }

  code: string;
  uuid?: string;
}

export class IntegrationNotFoundError extends Error implements UseCaseError {
  constructor() {
    super('Integration not found');
    this.name = 'IntegrationNotFoundError';
    this.code = 'INTEGRATION_NOT_FOUND_ERROR';
  }

  code: string;
  uuid?: string;
}
