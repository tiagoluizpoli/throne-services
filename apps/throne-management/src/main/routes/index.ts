import { Router } from 'express'

import { integrationRouter } from '@/main/routes/integration-routes'
import { otherRouter } from '@/main/routes/other-routes'

const router = Router()
router.use('/api/v1/integrations', integrationRouter)
router.use('/', otherRouter)

export { router }
