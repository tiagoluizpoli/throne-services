import {
  CreateIntegrationController,
  DeleteIntegrationController,
  GetIntegrationsController,
  UpdateIntegrationController,
} from '@/api';
import type { Controller } from '@solutions/core/api';
import { container } from 'tsyringe';
import { injectionTokens } from './injection-tokens';

const { controller } = injectionTokens;

export const registerControllerInjections = () => {
  container.register<Controller>(controller.createIntegration, CreateIntegrationController);
  container.register<Controller>(controller.updateIntegration, UpdateIntegrationController);
  container.register<Controller>(controller.deleteIntegration, DeleteIntegrationController);
  container.register<Controller>(controller.getIntegrations, GetIntegrationsController);

  const instancesRegistered = {
    [controller.createIntegration]: `instance of ${CreateIntegrationController.name}`,
    [controller.updateIntegration]: `instance of ${UpdateIntegrationController.name}`,
    [controller.deleteIntegration]: `instance of ${DeleteIntegrationController.name}`,
    [controller.getIntegrations]: `instance of ${GetIntegrationsController.name}`,
  };

  console.debug('controller injections registered', instancesRegistered);
};
