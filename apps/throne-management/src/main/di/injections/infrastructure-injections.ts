import type { IntegrationRepository, MappingRepository } from '@/application';
import { DrizzleIntegrationRepository, DrizzleMappingRepository } from '@/infrastructure';
import { registerInjection } from '../helpers';
import { injectionTokens } from '../injection-tokens';

const { infrastructure } = injectionTokens;

export const registerInfrastructureInjections = () => {
  registerInjection<IntegrationRepository>(infrastructure.integrationRepository, DrizzleIntegrationRepository);
  registerInjection<MappingRepository>(infrastructure.mappingRepository, DrizzleMappingRepository);
};
