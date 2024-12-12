import {
  DbCreateIntegration,
  DbDeleteIntegration,
  DbGetIntegrationById,
  DbGetIntegrations,
  DbUpdateIntegration,
} from '@/application';
import type {
  CreateIntegration,
  DeleteIntegration,
  GetIntegrationById,
  GetIntegrations,
  UpdateIntegration,
} from '@/domain';
import { container } from 'tsyringe';
import { injectionTokens } from './injection-tokens';

const { application } = injectionTokens;

export const registerApplicationInjections = () => {
  container.register<CreateIntegration>(application.createIntegration, DbCreateIntegration);
  container.register<UpdateIntegration>(application.updateIntegration, DbUpdateIntegration);
  container.register<DeleteIntegration>(application.deleteIntegration, DbDeleteIntegration);
  container.register<GetIntegrations>(application.getIntegrations, DbGetIntegrations);
  container.register<GetIntegrationById>(application.getIntegrationById, DbGetIntegrationById);

  const instancesRegistered = {
    [application.createIntegration]: `instance of ${DbCreateIntegration.name}`,
    [application.updateIntegration]: `instance of ${DbUpdateIntegration.name}`,
    [application.deleteIntegration]: `instance of ${DbDeleteIntegration.name}`,
    [application.getIntegrations]: `instance of ${DbGetIntegrations.name}`,
    [application.getIntegrationById]: `instance of ${DbGetIntegrationById.name}`,
  };

  console.debug('application injections registered', instancesRegistered);
};
