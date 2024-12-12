import { injectionLoggerTokens } from '@solutions/logger';

export const injectionTokens = {
  global: {
    loggerConfig: injectionLoggerTokens.loggerProps,
    logger: injectionLoggerTokens.logger,
  },
  infrastructure: {
    integrationRepository: 'infrastructure.integration-repository',
  },
  application: {
    createIntegration: 'application.create-integration',
    updateIntegration: 'application.update-integration',
    deleteIntegration: 'application.delete-integration',
    getIntegrations: 'application.get-integrations',
  },
  controller: {
    createIntegration: 'controller.create-integration',
    updateIntegration: 'controller.update-integration',
    deleteIntegration: 'controller.delete-integration',
    getIntegrations: 'controller.get-integrations',
  },
};
