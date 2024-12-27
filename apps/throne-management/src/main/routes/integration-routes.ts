import { adaptRoute } from '@solutions/core/main';
import { Router } from 'express';
import { injectionTokens } from '../di/injection-tokens';
import { mappingRouter } from './mapping-routes';

const { controller } = injectionTokens;

export const integrationRouter = Router();

integrationRouter.use('/:integrationId/mappings', mappingRouter);

integrationRouter.post('/', adaptRoute(controller.createIntegration));
integrationRouter.put('/:integrationId', adaptRoute(controller.updateIntegration));
integrationRouter.delete('/:integrationId', adaptRoute(controller.deleteIntegration));
integrationRouter.get('/', adaptRoute(controller.getIntegrations));
integrationRouter.get('/:integrationId', adaptRoute(controller.getIntegrationById));
