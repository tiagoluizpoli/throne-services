import { injectionLoggerTokens } from '@solutions/logger'

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
  },
  controller: {
    createIntegration: 'controller.create-integration',
    updateIntegration: 'controller.update-integration',
  },
}
