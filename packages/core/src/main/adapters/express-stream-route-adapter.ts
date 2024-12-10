import type { Request, Response } from 'express'
import { container } from 'tsyringe'

import type { Controller } from '../../api/contracts'

export const adaptStreamRoute = (controllerName: string) => {
  return async (request: Request, response: Response) => {
    const controller = container.resolve<Controller>(controllerName)
    const requestData = {
      ...request.body,
      ...request.params,
      ...request.query,
      tenantCode: request.headers['x-throne-tenant'],
      userId: request.headers['x-throne-userid'],
    }

    const authorizationtokenRegex = /^authorizationtoken$/i

    for (const key in request.headers) {
      if (authorizationtokenRegex.test(key)) {
        requestData.authorizationToken = request.headers[key]
      }
    }

    const httpResponse = await controller.handle(requestData)

    if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
      response.setHeader('Content-Type', httpResponse.body.type)
      return httpResponse.body.file.pipe(response)
    }

    return response.status(httpResponse.statusCode).json({
      error: httpResponse.body.message,
    })
  }
}
