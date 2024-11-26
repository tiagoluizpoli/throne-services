import { type Controller, type HttpError, type HttpResponse, serverError } from '@/api'

export class ErrorHandlingControllerDecorator implements Controller {
  constructor(private readonly controller: Controller) {}

  handle = async (request: any): Promise<HttpResponse> => {
    try {
      const httpResponse = await this.controller.handle(request)

      return httpResponse
    } catch (error) {
      console.log(error)
      return serverError(error as HttpError)
    }
  }
}
