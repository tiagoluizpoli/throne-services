import type { HttpError, HttpErrorResult } from './http-error';

export class UnprocessableEntityError extends Error implements HttpError {
  constructor(code: string, message: string, uuid?: string) {
    super(message);
    this.name = 'UnprocessableEntityError';
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
