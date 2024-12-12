import type { HttpError, HttpErrorResult } from './http-error';

export class TooManyRequestsError extends Error implements HttpError {
  constructor(code: string, message: string, uuid?: string) {
    super(message);
    this.name = 'TooManyRequestsError';
    this.code = code;
    this.uuid = uuid;
  }

  toResult = (): HttpErrorResult => {
    return {
      code: this.code,
      message: this.message,
      uuid: this.uuid,
    };
  };

  code: string;
  uuid?: string;
}
