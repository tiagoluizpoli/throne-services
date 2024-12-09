import type { Integration } from '@/domain/entities'

export interface ExamplesRepositoryGetAllParams {
  tenantCode: string
  search?: string
  pageIndex: number
  pageSize: number
  orderBy: 'createdAt'
  orderDirection: 'desc' | 'asc'
}

export type ExamplesRepositoryGetAllResult = Integration[]

export interface ExamplesRepositoryCountParams {
  tenantCode: string
  search?: string
}

export interface ExamplesRepositoryGetByIdParams {
  tenantCode: string
  exampleId: string
}

export interface ExamplesRepository {
  getAll: (params: ExamplesRepositoryGetAllParams) => Promise<ExamplesRepositoryGetAllResult>
  count: (params: ExamplesRepositoryCountParams) => Promise<number>
  getById: (params: ExamplesRepositoryGetByIdParams) => Promise<Integration | undefined>
  save: (example: Integration) => Promise<void>
}
