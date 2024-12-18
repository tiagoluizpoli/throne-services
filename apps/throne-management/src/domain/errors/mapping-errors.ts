import type { UseCaseError } from '@solutions/core/domain';

export class MappingAlreadyExistsError extends Error implements UseCaseError {
  constructor() {
    super('Mapping already exists');
    this.name = 'MappingAlreadyExistsError';
    this.code = 'MAPPING_ALREADY_EXISTS_ERROR';
  }

  code: string;
  uuid?: string;
}
