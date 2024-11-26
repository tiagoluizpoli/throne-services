import type { HttpError, HttpErrorResult } from '@/api/errors/http-error'

export class ServerError extends Error implements HttpError {
  constructor(stack: string, uuid?: string) {
    super('Internal server error')
    this.name = 'ServerError'
    this.code = 'SERVER_ERROR'
    this.stack = stack
    this.uuid = uuid
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
