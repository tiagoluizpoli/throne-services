import type { IntegrationRepository, MappingRepository } from '@/application/contracts';
import {
  type CreateMapping,
  type CreateMappingParams,
  type CreateMappingPossibleErrors,
  Mapping,
  Schema,
} from '@/domain';
import { IntegrationNotFoundError, MappingAlreadyExistsError } from '@/domain/errors';
import { injectionTokens } from '@/main/di/injection-tokens';
import { type Either, UnexpectedError, left, right } from '@solutions/core/domain';
import type { Logger } from '@solutions/logger';
import type { DatabaseError } from 'pg';
import { inject, injectable } from 'tsyringe';
import { SchemaParser } from './helpers';

const { global, infrastructure } = injectionTokens;

@injectable()
export class DbCreateMapping implements CreateMapping {
  private readonly schemaParser: SchemaParser;

  constructor(
    @inject(infrastructure.integrationRepository) private readonly integrationRepository: IntegrationRepository,
    @inject(infrastructure.mappingRepository) private readonly mappingRepository: MappingRepository,
    @inject(global.logger) private readonly logger: Logger,
  ) {
    this.schemaParser = new SchemaParser();
  }

  execute = async (params: CreateMappingParams): Promise<Either<CreateMappingPossibleErrors, void>> => {
    try {
      const { tenantCode, integrationId, type, sourceSchemaProps, targetSchemaProps } = params;

      const integration = await this.integrationRepository.getById({
        tenantCode,
        id: integrationId,
      });

      if (!integration) {
        return left(new IntegrationNotFoundError());
      }

      const sourceSchema = Schema.create({
        integrationId: integration.id,
        integration,
        name: sourceSchemaProps.name,
        schema: sourceSchemaProps.schema,
        createdAt: new Date(),
      });

      const targetSchema = Schema.create({
        integrationId: integration.id,
        integration,
        name: targetSchemaProps.name,
        schema: targetSchemaProps.schema,
        createdAt: new Date(),
      });

      const mapping = Mapping.create({
        integrationId: integration.id,
        integration,
        type,
        sourceSchemaId: sourceSchema.id,
        sourceSchema,
        targetSchemaId: targetSchema.id,
        targetSchema,
        createdAt: new Date(),
      });

      await this.mappingRepository.create(mapping);

      return right(undefined);
    } catch (error) {
      const mappedError = error as DatabaseError;

      if (mappedError?.code === '23505') {
        this.logger.error('DbCreateMapping.execute :: integration already exists', { error: JSON.stringify(error) });

        return left(new MappingAlreadyExistsError());
      }
      this.logger.error('DbCreateMapping.execute :: an error has occurred', { error: JSON.stringify(error) });

      return left(new UnexpectedError());
    }
  };
}
