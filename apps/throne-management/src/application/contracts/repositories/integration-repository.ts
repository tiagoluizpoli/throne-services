import type { Integration } from '@/domain/entities'

export interface IntegrationRepositoryGetAllParams {
  tenantCode: string
  search?: string
  pageIndex: number
  pageSize: number
  orderBy: 'createdAt'
  orderDirection: 'desc' | 'asc'
}

export type IntegrationRepositoryGetAllResult = Integration[]

export interface IntegrationRepositoryCountParams {
  tenantCode: string
  search?: string
}

export interface IntegrationRepositoryGetByIdParams {
  tenantCode: string
  exampleId: string
}

export interface IntegrationRepository {
  create: (integration: Integration) => Promise<void>
  // update: (integration: Integration) => Promise<void>
  // count: (params: IntegrationRepositoryCountParams) => Promise<number>
  // getAll: (params: IntegrationRepositoryGetAllParams) => Promise<IntegrationRepositoryGetAllResult>
  // getById: (params: IntegrationRepositoryGetByIdParams) => Promise<Integration | undefined>
}