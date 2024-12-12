import type { Request, Response } from 'express';
import { container } from 'tsyringe';
import type { Controller } from '../../api/contracts';

export const adaptRoute = (controllerName: string) => {
  return async (request: Request, response: Response) => {
    const controller = container.resolve<Controller>(controllerName);

    const requestData = {
      ...request.body,
      ...request.params,
      ...request.query,
    };

    const authorizationtokenRegex = /^authorizationtoken$/i;
    const accesstokenRegex = /^accesstoken$/i;

    for (const key in request.headers) {
      if (authorizationtokenRegex.test(key)) {
        requestData.authorizationToken = request.headers[key];
      }
      if (accesstokenRegex.test(key)) {
        requestData.accessToken = request.headers[key];
      }
    }

    if (request.headers['x-throne-tenant']) {
      requestData.tenantCode = request.headers['x-throne-tenant'];
    }

    if (request.headers['x-throne-userid']) {
      requestData.userId = request.headers['x-throne-userid'];
    }

    if (request.headers['x-throne-hub']) {
      requestData.mfaRequired = request.headers['x-throne-hub'] === 'true';
    }

    if (request.headers['x-throne-external-user-id']) {
      requestData.externalUserId = request.headers['x-throne-external-user-id'];
    }

    const httpResponse = await controller.handle(requestData);

    if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
      return response.status(httpResponse.statusCode).json(httpResponse.body);
    }

    return response.status(httpResponse.statusCode).json(httpResponse.body.toResult());
  };
};
