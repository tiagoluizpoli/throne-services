import { Schema } from '@/domain';
import type { schemaTable } from 'drizzle/schemas';

type SchemaPersistence = typeof schemaTable.$inferSelect;

export class SchemaMapper {
  static toDomain = (raw: SchemaPersistence): Schema => {
    return Schema.create(
      {
        integrationId: raw.integrationId,
        name: raw.name,
        schema: raw.schema as object,
        createdAt: raw.createdAt,
      },
      raw.id,
    );
  };
}
