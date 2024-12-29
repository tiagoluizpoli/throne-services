import type { DeleteMapping, DeleteMappingParams, DeleteMappingPossibleErrors } from '@/domain';
import { type Either, UnexpectedError, type UseCaseError, left, right } from '@solutions/core/domain';

import type { MappingRepository } from '@/application/contracts';
import { injectionTokens } from '@/main/di/injection-tokens';
import type { Logger } from '@solutions/logger';
import { inject, injectable } from 'tsyringe';

const { global, infrastructure } = injectionTokens;

@injectable()
export class DbDeleteMapping implements DeleteMapping {
  constructor(
    @inject(infrastructure.mappingRepository) private readonly mappingRepository: MappingRepository,
    @inject(global.logger) private readonly logger: Logger,
  ) {}

  execute = async (params: DeleteMappingParams): Promise<Either<DeleteMappingPossibleErrors, void>> => {
    try {
      const { tenantCode, integrationId, id } = params;

      await this.mappingRepository.delete({ tenantCode, integrationId, mappingId: id });

      return right(undefined);
    } catch (error) {
      const useCaseError: UseCaseError = error as UseCaseError;

      if (useCaseError.code === 'MAPPING_NOT_FOUND_ERROR') {
        return left(useCaseError);
      }

      this.logger.error('DbDeleteMapping.execute :: an error has occurred', { error: JSON.stringify(error) });

      return left(new UnexpectedError());
    }
  };
}
