import type {
  GetIntegrationById,
  GetIntegrationByIdParams,
  GetIntegrationByIdPossibleErrors,
  Integration,
} from '@/domain';
import { IntegrationNotFoundError } from '@/domain/errors';
import { injectionTokens } from '@/main/di';
import { type Either, UnexpectedError, left, right } from '@solutions/core/domain';
import type { Logger } from '@solutions/logger';
import { inject, injectable } from 'tsyringe';
import type { IntegrationRepository } from '../contracts';

const { infrastructure, global } = injectionTokens;

@injectable()
export class DbGetIntegrationById implements GetIntegrationById {
  constructor(
    @inject(infrastructure.integrationRepository) private readonly integrationRepository: IntegrationRepository,
    @inject(global.logger) private readonly logger: Logger,
  ) {}

  execute = async (
    params: GetIntegrationByIdParams,
  ): Promise<Either<GetIntegrationByIdPossibleErrors, Integration>> => {
    try {
      const { tenantCode, integrationId } = params;
      this.logger.addTag('extractionId', integrationId);
      this.logger.info('DbGetIntegrationById.execute :: getting integration by id');

      const integration = await this.integrationRepository.getById({
        tenantCode,
        id: integrationId,
      });

      if (!integration) {
        this.logger.error('DbGetIntegrationById.execute :: integration not found');

        return left(new IntegrationNotFoundError());
      }

      return right(integration);
    } catch (error) {
      this.logger.error('DbGetIntegrationById.execute :: an error has occurred', { error: JSON.stringify(error) });

      return left(new UnexpectedError());
    }
  };
}
