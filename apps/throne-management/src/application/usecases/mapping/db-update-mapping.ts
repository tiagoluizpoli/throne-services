import type { MappingRepository } from '@/application/contracts';
import type { UpdateMapping, UpdateMappingParams, UpdateMappingPossibleErrors } from '@/domain';
import { IntegrationNotFoundError, MappingNotFoundError } from '@/domain/errors';
import { injectionTokens } from '@/main/di/injection-tokens';
import { type Either, UnexpectedError, left, right } from '@solutions/core/domain';
import type { Logger } from '@solutions/logger';
import { inject, injectable } from 'tsyringe';

const { global, infrastructure } = injectionTokens;

@injectable()
export class DbUpdateMapping implements UpdateMapping {
  constructor(
    @inject(infrastructure.mappingRepository) private readonly mappingRepository: MappingRepository,
    @inject(global.logger) private readonly logger: Logger,
  ) {}

  execute = async (params: UpdateMappingParams): Promise<Either<UpdateMappingPossibleErrors, void>> => {
    try {
      const { id, integrationId, tenantCode, sourceSchemaProps, targetSchemaProps } = params;

      const mapping = await this.mappingRepository.getById({
        tenantCode,
        integrationId,
        mappingId: id,
      });

      if (!mapping) {
        return left(new MappingNotFoundError());
      }

      if (!mapping.integration) {
        return left(new IntegrationNotFoundError());
      }

      mapping.sourceSchema?.update({
        name: sourceSchemaProps.name,
        schema: sourceSchemaProps.schema,
      });

      mapping.targetSchema?.update({
        name: targetSchemaProps.name,
        schema: targetSchemaProps.schema,
      });

      await this.mappingRepository.update(mapping);

      return right(undefined);
    } catch (error) {
      console.error(error);
      this.logger.error('DbUpdateMapping.execute :: an error has occurred', { error: JSON.stringify(error) });

      return left(new UnexpectedError());
    }
  };
}
