import { injectionLoggerTokens } from '@solutions/logger';

export const injectionTokens = {
  global: {
    loggerConfig: injectionLoggerTokens.loggerProps,
    logger: injectionLoggerTokens.logger,
  },
  infrastructure: {
    integrationRepository: 'infrastructure.integration-repository',
    mappingRepository: 'infrastructure.mapping-repository',
  },
  application: {
    createIntegration: 'application.create-integration',
    updateIntegration: 'application.update-integration',
    deleteIntegration: 'application.delete-integration',
    getIntegrations: 'application.get-integrations',
    getIntegrationById: 'application.get-integration-by-id',
    createMapping: 'application.create-mapping',
  },
  controller: {
    createIntegration: 'controller.create-integration',
    updateIntegration: 'controller.update-integration',
    deleteIntegration: 'controller.delete-integration',
    getIntegrations: 'controller.get-integrations',
    getIntegrationById: 'controller.get-integration-by-id',
    createMapping: 'controller.create-mapping',
  },
};
