import type { ZodSchema } from 'zod';
import { type Controller, type HttpError, InvalidParamError, badRequest, serverError } from '../../api';

import type { Constructor } from './decorator-types';

export const controllerErrorHandling = () => {
  return <T extends Constructor<Controller>>(target: T) => {
    const originalHandle = target.prototype.handle;

    target.prototype.handle = async function (request: any) {
      try {
        const httpResponse = await originalHandle.apply(this, [request]);

        return httpResponse;
      } catch (error) {
        console.log(error);
        return serverError(error as HttpError);
      }
    };

    return target;
  };
};

export const controllerValidationHandling = (schema: ZodSchema<any>) => {
  return <T extends Constructor<Controller>>(target: T) => {
    const originalHandle = target.prototype.handle;

    target.prototype.handle = async function (request: any) {
      const validationResult = await schema.safeParseAsync(request);

      if (!validationResult.success) {
        const firstFieldWithError = validationResult.error.issues[0].path[0].toString();
        const errorMessage = validationResult.error.issues[0].message;
        return badRequest(new InvalidParamError(firstFieldWithError, errorMessage));
      }

      const httpResponse = await originalHandle.apply(this, [validationResult.data]);

      return httpResponse;
    };

    return target;
  };
};
