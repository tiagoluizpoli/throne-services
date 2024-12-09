import { Router } from 'express'

import { exampleRouter } from '@/main/routes/example-routes'
import { otherRouter } from '@/main/routes/other-routes'

const router = Router()
router.use('/api/v1/examples', exampleRouter)
router.use('/', otherRouter)

export { router }
