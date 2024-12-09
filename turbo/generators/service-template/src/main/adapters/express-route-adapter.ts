import type { Request, Response } from 'express'
import { container } from 'tsyringe'

import type { Controller } from '@/api/contracts'

export const adaptRoute = (controllerName: string) => {
  return async (request: Request, response: Response) => {
    const controller = container.resolve<Controller>(controllerName)

    const requestData = {
      ...request.body,
      ...request.params,
      ...request.query,
      tenant: request.headers['x-sta-tenant'],
      userId: request.headers['x-sta-userid'],
    }

    const httpResponse = await controller.handle(requestData)

    if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
      return response.status(httpResponse.statusCode).json(httpResponse.body)
    }

    return response.status(httpResponse.statusCode).json({
      error: httpResponse.body.message,
    })
  }
}
