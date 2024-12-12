import type { z } from 'zod';

import { type getAllExamplesRequestSchema, mapErrorsByCode, ok } from '@/api';
import type { Controller, HttpResponse } from '@/api/contracts';
import type { GetAllExamples } from '@/domain';
import { inject } from 'tsyringe';

export type GetAllExamplesRequest = z.infer<typeof getAllExamplesRequestSchema>;

export class GetAllExamplesController implements Controller {
  constructor(@inject('GetAllExamples') private readonly getAllExamples: GetAllExamples) {}

  handle = async (request: GetAllExamplesRequest): Promise<HttpResponse> => {
    const { tenant, search, pageIndex, pageSize, orderBy, orderDirection } = request;

    const getAllExamplesResult = await this.getAllExamples.execute({
      tenantCode: tenant,
      search,
      pageIndex,
      pageSize,
      orderBy,
      orderDirection,
    });

    if (getAllExamplesResult.isLeft()) {
      return mapErrorsByCode(getAllExamplesResult.value);
    }

    const examplesResult = getAllExamplesResult.value;

    const response = {
      total: examplesResult.total,
      items: examplesResult.examples.map((example) => ({
        id: example.id,
        code: example.code,
        name: example.name,
        description: example.description,
        createdAt: example.createdAt,
      })),
    };

    return ok(response);
  };
}
