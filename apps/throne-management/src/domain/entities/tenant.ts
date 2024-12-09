import { Entity } from '@/domain/core'

interface TenantProps {
  code: string
}

export class Tenant extends Entity<TenantProps> {
  private constructor(props: TenantProps, id?: string) {
    super(props, id)
  }

  get code(): string {
    return this.props.code
  }

  public static create(props: TenantProps, id?: string): Tenant {
    const tenant = new Tenant(props, id)
    return tenant
  }
}
