import {
  CreateIntegrationController,
  CreateMappingController,
  DeleteIntegrationController,
  GetIntegrationByIdController,
  GetIntegrationsController,
  UpdateIntegrationController,
  UpdateMappingController,
  UpdateMappingTemplateController,
} from '@/api';
import type { Controller } from '@solutions/core/api';
import { registerInjection } from '../helpers';
import { injectionTokens } from '../injection-tokens';

const { controller } = injectionTokens;

export const registerControllerInjections = () => {
  registerInjection<Controller>(controller.createIntegration, CreateIntegrationController);
  registerInjection<Controller>(controller.updateIntegration, UpdateIntegrationController);
  registerInjection<Controller>(controller.deleteIntegration, DeleteIntegrationController);
  registerInjection<Controller>(controller.getIntegrations, GetIntegrationsController);
  registerInjection<Controller>(controller.getIntegrationById, GetIntegrationByIdController);
  registerInjection<Controller>(controller.createMapping, CreateMappingController);
  registerInjection<Controller>(controller.updateMapping, UpdateMappingController);
  registerInjection<Controller>(controller.updateMappingTemplate, UpdateMappingTemplateController);
};
