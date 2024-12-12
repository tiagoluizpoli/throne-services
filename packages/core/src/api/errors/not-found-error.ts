import type { HttpError, HttpErrorResult } from './http-error';

export class NotFoundError extends Error implements HttpError {
  code: string;
  details?: any;
  uuid?: string;
  constructor(message: string, code?: string, details?: any, uuid?: string) {
    super(message);
    this.name = 'NotFoundError';
    this.code = code ?? 'NOT_FOUND_ERROR';
    this.details = details;
    this.uuid = uuid;
  }

  toResult = (): HttpErrorResult => {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
      uuid: this.uuid,
    };
  };
}
