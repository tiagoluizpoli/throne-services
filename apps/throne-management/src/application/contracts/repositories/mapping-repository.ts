import type { Mapping } from '@/domain';

export interface GetByIdMappingParams {
  tenantCode: string;
  integrationId: string;
  mappingId: string;
}

export interface MappingRepository {
  create: (mapping: Mapping) => Promise<void>;
  update: (mapping: Mapping) => Promise<void>;
  getById: (params: GetByIdMappingParams) => Promise<Mapping | undefined>;
}
