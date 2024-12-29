import type { DeleteMappingParams, GetByIdMappingParams, MappingRepository } from '@/application';
import type { Mapping } from '@/domain';
import { db } from '@/main/clients';
import { and, eq, inArray } from 'drizzle-orm';

import { MappingNotFoundError } from '@/domain/errors';
import { mappingTable, schemaTable } from 'drizzle/schemas';
import { MappingMapper } from './mappers';

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
  };

  update = async (mapping: Mapping): Promise<void> => {
    const { sourceSchema, targetSchema } = mapping;

    const result = await db.transaction(async (tx) => {
      if (sourceSchema) {
        await tx
          .update(schemaTable)
          .set({ name: sourceSchema.name, schema: sourceSchema.schema })
          .where(and(eq(schemaTable.integrationId, sourceSchema.integrationId), eq(schemaTable.id, sourceSchema.id)))
          .execute();
      }

      if (targetSchema) {
        await tx
          .update(schemaTable)
          .set({ name: targetSchema.name, schema: targetSchema.schema })
          .where(and(eq(schemaTable.integrationId, targetSchema.integrationId), eq(schemaTable.id, targetSchema.id)))
          .execute();
      }

      if (mapping.mappingTemplate || mapping.mappedSchema) {
        await tx
          .update(mappingTable)
          .set({
            mappingTemplate: mapping.mappingTemplate,
            mappedSchema: mapping.mappedSchema,
          })
          .where(and(eq(mappingTable.integrationId, mapping.integrationId), eq(mappingTable.id, mapping.id)))
          .execute();
      }
    });
  };

  getById = async (params: GetByIdMappingParams): Promise<Mapping | undefined> => {
    const { integrationId, mappingId, tenantCode } = params;
    const result = await db.query.mappingTable.findFirst({
      with: {
        integration: {
          with: {
            tenant: true,
          },
        },
        sourceSchema: true,
        targetSchema: true,
      },
      where: (mappingTable, { eq, and }) =>
        and(eq(mappingTable.id, mappingId), eq(mappingTable.integrationId, integrationId)),
    });

    if (!result) {
      return undefined;
    }

    return MappingMapper.toDomain(result);
  };

  delete = async (params: DeleteMappingParams): Promise<void> => {
    const { integrationId, mappingId } = params;

    await db.transaction(async (tx) => {
      const schemasToDelete = await tx
        .delete(mappingTable)
        .where(and(eq(mappingTable.integrationId, integrationId), eq(mappingTable.id, mappingId)))
        .returning({ sourceSchemaId: mappingTable.sourceSchemaId, targetSchemaId: mappingTable.targetSchemaId });

      if (schemasToDelete.length === 0) {
        throw new MappingNotFoundError();
      }

      const schemas = [schemasToDelete[0].sourceSchemaId, schemasToDelete[0].targetSchemaId];

      await tx
        .delete(schemaTable)
        .where(and(eq(schemaTable.integrationId, integrationId), inArray(schemaTable.id, schemas)))
        .execute();
    });
  };
}
