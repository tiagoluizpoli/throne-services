import type { Controller, HttpResponse } from '@solutions/core/api'

export class CreateIntegrationController implements Controller {
  handle = async (request: any): Promise<HttpResponse> => {
    throw new Error('Method not implemented.')
  }
}
