import { Entity } from '@solutions/core/domain';
import type { Integration } from './integration';

interface SchemaProps {
  integrationId: string;
  integration: Integration;
  code: string;
  name: string;
  schema: object;
  createdAt: Date;
}

export class Schema extends Entity<SchemaProps> {
  private constructor(props: SchemaProps, id?: string) {
    super(props, id);
  }

  get integrationId(): string {
    return this.props.integrationId;
  }

  get integration(): Integration {
    return this.props.integration;
  }

  get code(): string {
    return this.props.code;
  }

  get name(): string {
    return this.props.name;
  }

  get schema(): object {
    return this.props.schema;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  public static create(props: SchemaProps, id?: string): Schema {
    const schema = new Schema(props, id);
    return schema;
  }
}
