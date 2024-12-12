import { serverError } from '@/api';
import type { UseCaseError } from '@/domain/core';

export const errorMapper: Record<string, any> = {
  UNEXPECTED_ERROR: (error: UseCaseError) => serverError(error),
};
