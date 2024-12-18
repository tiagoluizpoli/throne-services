import { adaptRoute } from '@solutions/core/main';
import { Router } from 'express';
import { injectionTokens } from '../di';

export const mappingRouter = Router();

const { controller } = injectionTokens;
mappingRouter.post('/:integrationId', adaptRoute(controller.createMapping));
