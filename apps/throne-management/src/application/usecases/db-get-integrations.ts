import type {
  GetIntegrations,
  GetIntegrationsParams,
  GetIntegrationsPossibleErrors,
  GetIntegrationsResult,
} from '@/domain';
import { injectionTokens } from '@/main/di/injection-tokens';
import { type Either, UnexpectedError, left, right } from '@solutions/core/domain';
import type { Logger } from '@solutions/logger';
import { inject, injectable } from 'tsyringe';
import type { IntegrationRepository } from '../contracts';

const { global, infrastructure } = injectionTokens;

@injectable()
export class DbGetIntegrations implements GetIntegrations {
  constructor(
    @inject(infrastructure.integrationRepository) private readonly integrationRepository: IntegrationRepository,
    @inject(global.logger) private readonly logger: Logger,
  ) {}

  execute = async (
    params: GetIntegrationsParams,
  ): Promise<Either<GetIntegrationsPossibleErrors, GetIntegrationsResult>> => {
    try {
      const { tenantCode, search, pageIndex, pageSize, orderBy, orderDirection } = params;
      this.logger.info('DbGetIntegrations.execute :: getting integrations', {
        tenantCode,
        ...(search && { search }),
        pageIndex: pageIndex.toString(),
        pageSize: pageSize.toString(),
        orderBy,
        orderDirection,
      });

      const result = await this.integrationRepository.getAll({
        tenantCode,
        search,
        pageIndex,
        pageSize,
        orderBy,
        orderDirection,
      });

      return right({
        total: result.total,
        items: result.integrations,
      });
    } catch (error) {
      this.logger.error('DbGetIntegrations.execute :: an error has occurred', { error: JSON.stringify(error) });

      return left(new UnexpectedError());
    }
  };
}
