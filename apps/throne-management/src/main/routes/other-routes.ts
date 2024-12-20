import { type Request, type Response, Router } from 'express'

export const otherRouter = Router()

otherRouter.get('/', (req, res) => {
  res.send({
    serviceName: 'throne-management',
    version: '1.0.0',
  })
})

otherRouter.get('/healthCheck', (req: Request, res: Response): void => {
  res.status(200).json({ message: 'healthy' })
})
