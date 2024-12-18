import type { Mapping } from '@/domain';

export interface MappingRepository {
  create: (mapping: Mapping) => Promise<void>;
}
