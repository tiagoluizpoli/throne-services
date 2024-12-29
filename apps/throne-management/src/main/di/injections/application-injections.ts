import {
  DbCreateIntegration,
  DbCreateMapping,
  DbDeleteIntegration,
  DbDeleteMapping,
  DbGetIntegrationById,
  DbGetIntegrations,
  DbUpdateIntegration,
  DbUpdateMapping,
  DbUpdateMappingTemplate,
} from '@/application';
import type {
  CreateIntegration,
  CreateMapping,
  DeleteIntegration,
  DeleteMapping,
  GetIntegrationById,
  GetIntegrations,
  UpdateIntegration,
  UpdateMapping,
  UpdateMappingTemplate,
} from '@/domain';

import { registerInjection } from '../helpers';
import { injectionTokens } from '../injection-tokens';

const { application } = injectionTokens;

export const registerApplicationInjections = () => {
  registerInjection<CreateIntegration>(application.createIntegration, DbCreateIntegration);
  registerInjection<UpdateIntegration>(application.updateIntegration, DbUpdateIntegration);
  registerInjection<DeleteIntegration>(application.deleteIntegration, DbDeleteIntegration);
  registerInjection<GetIntegrations>(application.getIntegrations, DbGetIntegrations);
  registerInjection<GetIntegrationById>(application.getIntegrationById, DbGetIntegrationById);

  registerInjection<CreateMapping>(application.createMapping, DbCreateMapping);
  registerInjection<UpdateMapping>(application.updateMapping, DbUpdateMapping);
  registerInjection<UpdateMappingTemplate>(application.updateMappingTemplate, DbUpdateMappingTemplate);
  registerInjection<DeleteMapping>(application.deleteMapping, DbDeleteMapping);
};
