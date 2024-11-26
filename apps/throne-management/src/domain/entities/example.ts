import { Entity } from '@/domain/core'
import type { Tenant } from '@/domain/entities'

interface ExampleProps {
  tenantCode?: string
  tenant?: Tenant
  code: string
  name: string
  description: string
  createdAt: Date
}

export class Example extends Entity<ExampleProps> {
  private constructor(props: ExampleProps, id?: string) {
    super(props, id)
  }

  get tenantCode(): string | undefined {
    return this.props.tenantCode
  }

  get tenant(): Tenant | undefined {
    return this.props.tenant
  }

  get code(): string {
    return this.props.code
  }

  get name(): string {
    return this.props.name
  }

  get description(): string {
    return this.props.description
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  public static create(props: ExampleProps, id?: string): Example {
    const example = new Example(props, id)
    return example
  }
}
