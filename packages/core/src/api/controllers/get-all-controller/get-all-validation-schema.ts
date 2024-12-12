import { z } from 'zod';

export const getAllValidationSchema = z.object({
  tenant: z.string(),
  search: z.string().optional(),
  pageIndex: z.coerce.number().min(0).default(0),
  pageSize: z.coerce.number().min(1).max(100).default(10),
  orderBy: z.enum(['createdAt']).default('createdAt'),
  orderDirection: z.enum(['desc', 'asc']).default('desc'),
});
