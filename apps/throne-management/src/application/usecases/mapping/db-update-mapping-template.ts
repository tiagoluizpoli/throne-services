import type { MappingRepository } from '@/application/contracts';
import type { UpdateMappingTemplate, UpdateMappingTemplateParams, UpdateMappingTemplatePossibleErrors } from '@/domain';
import { IntegrationNotFoundError, MappingNotFoundError } from '@/domain/errors';
import { injectionTokens } from '@/main/di/injection-tokens';
import { type Either, UnexpectedError, left, right } from '@solutions/core/domain';
import type { Logger } from '@solutions/logger';
import { inject, injectable } from 'tsyringe';
import { type Mapping, SchemaParser } from './helpers';

const { global, infrastructure } = injectionTokens;

@injectable()
export class DbUpdateMappingTemplate implements UpdateMappingTemplate {
  private readonly schemaParser: SchemaParser;

  constructor(
    @inject(infrastructure.mappingRepository) private readonly mappingRepository: MappingRepository,
    @inject(global.logger) private readonly logger: Logger,
  ) {
    this.schemaParser = new SchemaParser();
  }

  execute = async (params: UpdateMappingTemplateParams): Promise<Either<UpdateMappingTemplatePossibleErrors, void>> => {
    try {
      const { tenantCode, integrationId, id, mappingTemplate } = params;
      const mapping = await this.mappingRepository.getById({
        tenantCode,
        integrationId,
        mappingId: id,
      });

      if (!mapping) {
        return left(new MappingNotFoundError());
      }

      if (!mapping.integration || mapping.integration.tenantCode !== tenantCode) {
        return left(new IntegrationNotFoundError());
      }

      const mappedSchema = this.schemaParser.buildJSONataMapping(mappingTemplate as Mapping);

      mapping.update({
        mappingTemplate,
        mappedSchema,
      });

      await this.mappingRepository.update(mapping);

      return right(undefined);
    } catch (error) {
      this.logger.error('DbUpdateMappingTemplate.execute :: an error has occurred', { error: JSON.stringify(error) });

      return left(new UnexpectedError());
    }
  };
}
