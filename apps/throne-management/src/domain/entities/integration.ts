import type { Tenant } from '@/domain/entities'
import { Entity } from '@solutions/core/domain'

export const Methods = ['GET', 'POST', 'PUT', 'DELETE'] as const
export type Method = (typeof Methods)[number]

interface IntegrationProps {
  tenantCode: string
  tenant?: Tenant
  code: string
  name: string
  description: string
  uniqueCode: string
  sourceMethod: Method
  targetMethod: Method
  targetUrl: string
  createdAt: Date
}

export class Integration extends Entity<IntegrationProps> {
  private constructor(props: IntegrationProps, id?: string) {
    super(props, id)
  }

  get tenantCode(): string {
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

  get uniqueCode(): string {
    return this.props.uniqueCode
  }

  get sourceMethod(): Method {
    return this.props.sourceMethod
  }

  get targetMethod(): Method {
    return this.props.targetMethod
  }

  get targetUrl(): string {
    return this.props.targetUrl
  }

  get description(): string {
    return this.props.description
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  public static create(props: IntegrationProps, id?: string): Integration {
    const example = new Integration(props, id)
    return example
  }
}
