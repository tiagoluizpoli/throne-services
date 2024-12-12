import {
  type CreateIntegration,
  type CreateIntegrationParams,
  type CreateIntegrationPossibleErrors,
  Integration,
} from '@/domain';
import { type Either, UnexpectedError, left, right } from '@solutions/core/domain';
import type { Logger } from '@solutions/logger';
import { inject, injectable } from 'tsyringe';
import type { IntegrationRepository } from '../contracts';

import { IntegrationAlreadyExistsError } from '@/domain/errors';
import { injectionTokens } from '@/main/di/injection-tokens';
import type { DatabaseError } from 'pg';
const { global, infrastructure } = injectionTokens;

@injectable()
export class DbCreateIntegration implements CreateIntegration {
  constructor(
    @inject(infrastructure.integrationRepository) private readonly integrationRepository: IntegrationRepository,
    @inject(global.logger) private readonly logger: Logger,
  ) {} // TODO: create injection token for integrationRepository

  execute = async (params: CreateIntegrationParams): Promise<Either<CreateIntegrationPossibleErrors, void>> => {
    try {
      this.logger.info('DbCreateIntegration.execute :: creating integration');
      const { tenantCode, code, name, description, sourceMethod, targetMethod, targetUrl } = params;

      const integration = Integration.create({
        code,
        name,
        description,
        sourceMethod,
        targetMethod,
        targetUrl,
        tenantCode,
      });

      await this.integrationRepository.create(integration);

      this.logger.info('DbCreateIntegration.execute :: integration inserted to the database');

      return right(undefined);
    } catch (error) {
      const mappedError = error as DatabaseError;

      // Postgress code for "unique constraint violated"
      if (mappedError?.code === '23505') {
        this.logger.error('DbCreateIntegration.execute :: a database error has occurred', {
          error: JSON.stringify(error),
        });

        return left(new IntegrationAlreadyExistsError());
      }
      this.logger.error('DbCreateIntegration.execute :: an error has occurred', { error: JSON.stringify(error) });

      return left(new UnexpectedError());
    }
  };
}
