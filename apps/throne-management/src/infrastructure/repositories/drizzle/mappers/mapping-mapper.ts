import { Mapping } from '@/domain';
import type { integrationTable, mappingTable, schemaTable, tenantTable } from 'drizzle/schemas';
import { IntegrationMapper } from './integration-mapper';
import { SchemaMapper } from './schema-mapper';

type MappingPersistence = typeof mappingTable.$inferSelect & {
  integration?: typeof integrationTable.$inferSelect & {
    tenant: typeof tenantTable.$inferSelect;
  };
  sourceSchema: typeof schemaTable.$inferSelect;
  targetSchema: typeof schemaTable.$inferSelect;
};

export class MappingMapper {
  static toDomain = (raw: MappingPersistence): Mapping => {
    return Mapping.create(
      {
        integrationId: raw.integrationId,
        integration: raw.integration ? IntegrationMapper.toDomainClean(raw.integration) : undefined,
        type: raw.type,
        sourceSchemaId: raw.sourceSchemaId,
        sourceSchema: SchemaMapper.toDomain(raw.sourceSchema),
        targetSchema: SchemaMapper.toDomain(raw.targetSchema),
        targetSchemaId: raw.targetSchemaId,
        createdAt: raw.createdAt,
      },
      raw.id,
    );
  };
}
