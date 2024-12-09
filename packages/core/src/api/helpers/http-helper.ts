import type { Readable } from 'node:stream'

import type { UnexpectedError, UseCaseError } from '../../domain/errors'
import type { HttpResponse } from '../contracts'
import {
  BadRequestError,
  type HttpError,
  ServerError,
  TooManyRequestsError,
  UnauthorizedError,
  UnprocessableEntityError,
} from '../errors'

export interface File {
  file: Readable
  type: string
}

export const file = <File>(data: File): HttpResponse => ({
  statusCode: 200,
  body: data,
})

export const ok = <T>(data?: T): HttpResponse => ({
  statusCode: 200,
  body: data,
})

export const created = (): HttpResponse => ({
  statusCode: 201,
  body: undefined,
})

export const noContent = (): HttpResponse => ({
  statusCode: 204,
  body: null,
})

export const badRequest = (error: UseCaseError): HttpResponse => ({
  statusCode: 400,
  body: new BadRequestError(error.code, error.message, error.uuid),
})

export const notFound = (error: UseCaseError): HttpResponse => ({
  statusCode: 404,
  body: error,
})

export const unprocessableEntity = (error: UseCaseError): HttpResponse => ({
  statusCode: 422,
  body: new UnprocessableEntityError(error.code, error.message, error.uuid),
})

export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError(),
})

export const forbidden = (error: UseCaseError): HttpResponse => ({
  statusCode: 403,
  body: error,
})

export const tooManyRequests = (error: UseCaseError): HttpResponse => ({
  statusCode: 429,
  body: new TooManyRequestsError(error.code, error.message, error.uuid),
})

type ServerErrors = HttpError | UnexpectedError
export const serverError = (error: ServerErrors): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack ?? '', error.uuid),
})
