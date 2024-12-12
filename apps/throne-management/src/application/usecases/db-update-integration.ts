import type { UpdateIntegration, UpdateIntegrationParams, UpdateIntegrationPossibleErrors } from '@/domain';
import { injectionTokens } from '@/main/di/injection-tokens';

import { IntegrationAlreadyExistsError, IntegrationNotFoundError } from '@/domain/errors';
import { type Either, UnexpectedError, left, right } from '@solutions/core/domain';
import type { Logger } from '@solutions/logger';
import type { DatabaseError } from 'pg';
import { inject, injectable } from 'tsyringe';
import type { IntegrationRepository } from '../contracts';

const { global, infrastructure } = injectionTokens;

@injectable()
export class DbUpdateIntegration implements UpdateIntegration {
  constructor(
    @inject(infrastructure.integrationRepository) private readonly integrationRepository: IntegrationRepository,
    @inject(global.logger) private readonly logger: Logger,
  ) {}

  execute = async (params: UpdateIntegrationParams): Promise<Either<UpdateIntegrationPossibleErrors, void>> => {
    try {
      const { tenantCode, id, code, name, description, sourceMethod, targetMethod, targetUrl } = params;
      this.logger.addTag('extractionId', id);
      this.logger.info('DbUpdateIntegration.execute :: updating integration');

      const integration = await this.integrationRepository.getById({
        id,
        tenantCode,
      });

      if (!integration) {
        this.logger.error('DbUpdateIntegration.execute :: integration not found');

        return left(new IntegrationNotFoundError());
      }

      integration.update({
        code,
        name,
        description,
        sourceMethod,
        targetMethod,
        targetUrl,
      });

      await this.integrationRepository.update(integration);

      this.logger.info('DbUpdateIntegration.execute :: integration updated');

      return right(undefined);
    } catch (error) {
      const mappedError = error as DatabaseError;

      // Postgress code for "unique constraint violated"
      if (mappedError?.code === '23505') {
        this.logger.error('DbUpdateIntegration.execute :: a database error has occurred', {
          error: JSON.stringify(error),
        });

        return left(new IntegrationAlreadyExistsError());
      }

      this.logger.error('DbUpdateIntegration.execute :: an error has occurred', { error: JSON.stringify(error) });

      return left(new UnexpectedError());
    }
  };
}
