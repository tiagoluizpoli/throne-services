import { Entity } from './entity'

interface TenantProps {
  code: string
}

export class Tenant extends Entity<TenantProps> {
  get code(): string {
    return this.props.code
  }

  private constructor(props: TenantProps, id?: string) {
    super(props)
  }

  public static create(props: TenantProps, id?: string): Tenant {
    const tenant = new Tenant(props, id)
    return tenant
  }
}
