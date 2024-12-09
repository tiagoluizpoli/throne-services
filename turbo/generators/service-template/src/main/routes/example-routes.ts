import { Router } from 'express'

import { adaptRoute } from '@/main/adapters'

export const exampleRouter = Router()

exampleRouter.get('/', adaptRoute('GetAllExamplesController'))
