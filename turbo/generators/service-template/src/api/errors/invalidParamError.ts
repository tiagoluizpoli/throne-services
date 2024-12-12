import type { HttpError, HttpErrorResult } from '@/api';

export class InvalidParamError extends Error implements HttpError {
  code: string;
  uuid?: string;
  constructor(param: string, extraMessage?: string, uuid?: string) {
    super(`The received value for field "${param}" is invalid. ${extraMessage ?? ''}`);
    this.name = 'InvalidParamError';
    this.code = 'INVALID_PARAM_ERROR';
    this.uuid = uuid;
  }

  toResult = (): HttpErrorResult => {
    return {
      code: this.code,
      message: this.message,
      uuid: this.uuid,
    };
  };
}
