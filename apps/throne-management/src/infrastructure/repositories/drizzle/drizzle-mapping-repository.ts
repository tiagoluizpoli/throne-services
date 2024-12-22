import type { MappingRepository } from '@/application';
import type { Mapping } from '@/domain';
import { db } from '@/main/clients';

import { mappingTable, schemaTable } from 'drizzle/schemas';

export class DrizzleMappingRepository implements MappingRepository {
  create = async (mapping: Mapping): Promise<void> => {
    const { sourceSchema, targetSchema } = mapping;

    if (!sourceSchema || !targetSchema) {
      throw new Error("Mapping's source and target schema can't be null");
    }

    const result = await db.transaction(async (tx) => {
      const schemaId = await tx
        .insert(schemaTable)
        .values([
          {
            id: sourceSchema.id,
            integrationId: sourceSchema.integrationId,
            name: sourceSchema.name,
            createdAt: sourceSchema.createdAt,
            schema: sourceSchema.schema,
          },
          {
            id: targetSchema.id,
            integrationId: targetSchema.integrationId,
            name: targetSchema.name,
            createdAt: targetSchema.createdAt,
            schema: targetSchema.schema,
          },
        ])
        .returning({ id: schemaTable.id });

      await tx
        .insert(mappingTable)
        .values({
          id: mapping.id,
          integrationId: mapping.integrationId,
          type: mapping.type,
          sourceSchemaId: schemaId[0].id,
          targetSchemaId: schemaId[1].id,
          mappingTemplate: mapping.mappingTemplate,
          mappedSchema: mapping.mappedSchema,
          createdAt: mapping.createdAt,
        })
        .execute();
    });

    console.log({ result });
  };
}
