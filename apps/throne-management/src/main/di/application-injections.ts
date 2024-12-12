import { DbCreateIntegration, DbDeleteIntegration, DbUpdateIntegration } from '@/application';
import type { CreateIntegration, DeleteIntegration, UpdateIntegration } from '@/domain';
import { container } from 'tsyringe';
import { injectionTokens } from './injection-tokens';

const { application } = injectionTokens;

export const registerApplicationInjections = () => {
  container.register<CreateIntegration>(application.createIntegration, DbCreateIntegration);
  container.register<UpdateIntegration>(application.updateIntegration, DbUpdateIntegration);
  container.register<DeleteIntegration>(application.updateIntegration, DbDeleteIntegration);

  const instancesRegistered = {
    [application.createIntegration]: `instance of ${DbCreateIntegration.name}`,
    [application.updateIntegration]: `instance of ${DbUpdateIntegration.name}`,
    [application.deleteIntegration]: `instance of ${DbDeleteIntegration.name}`,
  };

  console.debug('application injections registered', instancesRegistered);
};
