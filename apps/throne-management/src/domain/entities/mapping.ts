import { Entity } from '@solutions/core/domain';
import type { Integration } from './integration';
import type { Schema } from './schema';

export const MappingTypes = ['input', 'output'] as const;
export type MappingType = (typeof MappingTypes)[number];

interface MappingProps {
  integrationId: string;
  integration: Integration;
  type: MappingType;
  sourceSchemaId: string;
  sourceSchema: Schema;
  targetSchemaId: string;
  targetSchema: Schema;
  mappedSchema: object;
  createdAt: Date;
}

export class Mapping extends Entity<MappingProps> {
  private constructor(props: any, id?: string) {
    super(props, id);
  }

  get integrationId(): string {
    return this.props.integrationId;
  }

  get integration(): Integration {
    return this.props.integration;
  }

  get type(): MappingType {
    return this.props.type;
  }

  get sourceSchemaId(): string {
    return this.props.sourceSchemaId;
  }

  get targetSchemaId(): string {
    return this.props.targetSchemaId;
  }

  get mappedSchema(): object {
    return this.props.mappedSchema;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  public static create(props: MappingProps, id?: string): Mapping {
    const mapping = new Mapping(props, id);
    return mapping;
  }
}
