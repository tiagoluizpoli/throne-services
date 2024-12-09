import { adaptRoute } from '@solutions/core/main'
import { Router } from 'express'

export const exampleRouter = Router()

exampleRouter.get('/', adaptRoute('GetAllExamplesController'))
