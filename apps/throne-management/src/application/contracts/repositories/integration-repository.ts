import type { Integration } from '@/domain/entities';

export interface IntegrationRepositoryGetAllParams {
  tenantCode: string;
  search?: string;
  pageIndex: number;
  pageSize: number;
  orderBy: 'createdAt';
  orderDirection: 'desc' | 'asc';
}

export type IntegrationRepositoryGetAllResult = {
  total: number;
  integrations: Integration[];
};

export interface IntegrationRepositoryGetByIdParams {
  tenantCode: string;
  id: string;
}

export interface IntegrationRepositoryDeleteParams {
  tenantCode: string;
  id: string;
}

export interface IntegrationRepository {
  create: (integration: Integration) => Promise<void>;
  update: (integration: Integration) => Promise<void>;
  delete: (params: IntegrationRepositoryDeleteParams) => Promise<void>;
  getAll: (params: IntegrationRepositoryGetAllParams) => Promise<IntegrationRepositoryGetAllResult>;
  getById: (params: IntegrationRepositoryGetByIdParams) => Promise<Integration | undefined>;
}
