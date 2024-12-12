import type { UnexpectedError } from '../errors';

import type { Either } from '@/domain/core';
import type { Example } from '@/domain/entities';

export interface GetAllExamplesParams {
  tenantCode: string;
  search?: string;
  pageIndex: number;
  pageSize: number;
  orderBy: 'createdAt';
  orderDirection: 'desc' | 'asc';
}

export interface GetAllExamplesResult {
  total: number;
  examples: Example[];
}

export type GetAllExamplesPossibleErrors = UnexpectedError;

export interface GetAllExamples {
  execute: (params: GetAllExamplesParams) => Promise<Either<GetAllExamplesPossibleErrors, GetAllExamplesResult>>;
}
