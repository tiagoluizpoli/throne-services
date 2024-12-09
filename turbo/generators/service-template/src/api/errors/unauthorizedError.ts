import type { HttpError, HttpErrorResult } from '@/api/errors/http-error'

export class UnauthorizedError extends Error implements HttpError {
  constructor() {
    super('Unauthorized')
    this.name = 'UnauthorizedError'
    this.code = 'UNAUTHORIZED_ERROR'
  }

  toResult = (): HttpErrorResult => {
    return {
      code: this.code,
      message: this.message,
      uuid: this.uuid,
    }
  }

  code: string
  uuid?: string
}
