import { adaptRoute } from '@solutions/core/main';
import { Router } from 'express';
import { injectionTokens } from '../di';

export const mappingRouter = Router({
  mergeParams: true,
});

const { controller } = injectionTokens;

mappingRouter.post('/', adaptRoute(controller.createMapping));
mappingRouter.put('/:mappingId', adaptRoute(controller.updateMapping));
