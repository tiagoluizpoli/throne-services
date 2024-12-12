import type { IntegrationRepository } from '@/application';
import { DrizzleIntegrationRepository } from '@/infrastructure';

import { injectionTokens } from './injection-tokens';
const { infrastructure } = injectionTokens;

import { container } from 'tsyringe';

export const registerInfrastructureInjections = () => {
  container.register<IntegrationRepository>(infrastructure.integrationRepository, DrizzleIntegrationRepository);

  const instancesRegistered = {
    [infrastructure.integrationRepository]: `instance of ${DrizzleIntegrationRepository.name}`,
  };

  console.debug('infrastructure injections registered', instancesRegistered);
};
