import { Entity } from '@solutions/core/domain'

interface TenantProps {
  name: string
  code: string
  description: string
  createdAt: Date
}

export class Tenant extends Entity<TenantProps> {
  private constructor(props: TenantProps, id?: string) {
    super(props, id)
  }
  get name(): string {
    return this.props.name
  }

  get code(): string {
    return this.props.code
  }

  get description(): string {
    return this.props.description
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  public static create(props: TenantProps, id?: string): Tenant {
    const tenant = new Tenant(props, id)
    return tenant
  }
}
