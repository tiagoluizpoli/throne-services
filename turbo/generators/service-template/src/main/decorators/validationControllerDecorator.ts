import type { ZodSchema } from 'zod'

import { type Controller, type HttpResponse, InvalidParamError, badRequest } from '@/api'

export class ValidationControllerDecorator implements Controller {
  constructor(
    private readonly controller: Controller,
    private readonly schema: ZodSchema<any>,
  ) {}

  handle = async (request: any): Promise<HttpResponse> => {
    const validationResult = await this.schema.safeParseAsync(request)

    if (!validationResult.success) {
      const firstFieldWithError = validationResult.error.issues[0].path[0].toString()
      const errorMessage = validationResult.error.issues[0].message
      return badRequest(new InvalidParamError(firstFieldWithError, errorMessage))
    }

    const httpResponse = await this.controller.handle(validationResult.data)

    return httpResponse
  }
}
