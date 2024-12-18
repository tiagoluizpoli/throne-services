import { Router } from 'express';

import { integrationRouter } from '@/main/routes/integration-routes';
import { otherRouter } from '@/main/routes/other-routes';
import { mappingRouter } from './mapping-routes';

const router = Router();
router.use('/api/v1/integrations', integrationRouter);
router.use('/api/v1/mappings', mappingRouter);
router.use('/', otherRouter);

export { router };
