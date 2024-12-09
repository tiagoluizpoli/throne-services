import { Entity } from '@solutions/core/domain'
import type { User } from './user'

interface TenantProps {
  code: string
  name: string
  description?: string
  apiKey: string
  availableUntil?: Date
  createdAt: Date
  users?: User[]
}

export class Tenant extends Entity<TenantProps> {
  private constructor(props: TenantProps, id?: string) {
    super(props, id)
  }

  get code(): string {
    return this.props.code
  }

  get name(): string {
    return this.props.name
  }

  get description(): string | undefined {
    return this.props.description
  }

  get apiKey(): string {
    return this.props.apiKey
  }

  get availableUntil(): Date | undefined {
    return this.props.availableUntil
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get users(): User[] | undefined {
    return this.props.users
  }

  public static create(props: TenantProps, id?: string): Tenant {
    const tenant = new Tenant(props, id)
    return tenant
  }
}
