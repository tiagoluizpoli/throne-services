import { adaptRoute } from '@solutions/core/main';
import { Router } from 'express';
import { injectionTokens } from '../di/injection-tokens';

export const integrationRouter = Router();

const { controller } = injectionTokens;

integrationRouter.post('/', adaptRoute(controller.createIntegration));
integrationRouter.put('/:integrationId', adaptRoute(controller.updateIntegration));
