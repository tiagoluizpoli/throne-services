import type { DeleteIntegration, DeleteIntegrationParams, DeleteIntegrationPossibleErrors } from '@/domain';
import { IntegrationNotFoundError } from '@/domain/errors';
import { injectionTokens } from '@/main/di/injection-tokens';
import { type Either, UnexpectedError, left, right } from '@solutions/core/domain';
import type { Logger } from '@solutions/logger';
import { inject, injectable } from 'tsyringe';
import type { IntegrationRepository } from '../contracts';

const { global, infrastructure } = injectionTokens;

@injectable()
export class DbDeleteIntegration implements DeleteIntegration {
  constructor(
    @inject(infrastructure.integrationRepository) private readonly integrationRepository: IntegrationRepository,
    @inject(global.logger) private readonly logger: Logger,
  ) {}

  execute = async (params: DeleteIntegrationParams): Promise<Either<DeleteIntegrationPossibleErrors, void>> => {
    try {
      this.logger.addTag('extractionId', params.id);
      this.logger.info('DbDeleteIntegration.execute :: deleting integration');
      const { tenantCode, id } = params;

      const integration = await this.integrationRepository.getById({
        tenantCode,
        id,
      });

      if (!integration) {
        this.logger.error('DbDeleteIntegration.execute :: integration not found');

        return left(new IntegrationNotFoundError());
      }

      await this.integrationRepository.delete({
        tenantCode,
        id,
      });

      this.logger.info('DbDeleteIntegration.execute :: integration deleted');

      return right(undefined);
    } catch (error) {
      this.logger.error('DbDeleteIntegration.execute :: an error has occurred', { error: JSON.stringify(error) });

      return left(new UnexpectedError());
    }
  };
}
