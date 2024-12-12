import type { Tenant } from '@/domain/entities';
import { Entity } from '@solutions/core/domain';
import { generateUniqueId } from '../helpers';

export const Methods = ['GET', 'POST', 'PUT', 'DELETE'] as const;
export type Method = (typeof Methods)[number];

interface IntegrationProps {
  tenantCode: string;
  tenant?: Tenant;
  code: string;
  name: string;
  description?: string;
  uniqueCode: string;
  sourceMethod: Method;
  targetMethod: Method;
  targetUrl: string;
  createdAt: Date;
}

type CreateIntegrationMandatoryProps = Pick<
  IntegrationProps,
  'tenantCode' | 'code' | 'name' | 'description' | 'sourceMethod' | 'targetMethod' | 'targetUrl'
>;
type CreateIntegrationOptionalProps = Partial<Pick<IntegrationProps, 'uniqueCode' | 'createdAt'>>;

type CreateIntegrationProps = CreateIntegrationMandatoryProps & CreateIntegrationOptionalProps;

export class Integration extends Entity<IntegrationProps> {
  private constructor(props: IntegrationProps, id?: string) {
    super(props, id);
  }

  get tenantCode(): string {
    return this.props.tenantCode;
  }

  get tenant(): Tenant | undefined {
    return this.props.tenant;
  }

  get code(): string {
    return this.props.code;
  }

  get name(): string {
    return this.props.name;
  }

  get uniqueCode(): string {
    return this.props.uniqueCode;
  }

  get sourceMethod(): Method {
    return this.props.sourceMethod;
  }

  get targetMethod(): Method {
    return this.props.targetMethod;
  }

  get targetUrl(): string {
    return this.props.targetUrl;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  public update(
    props: Pick<IntegrationProps, 'code' | 'name' | 'description' | 'sourceMethod' | 'targetMethod' | 'targetUrl'>,
  ): void {
    const { code, name, description, sourceMethod, targetMethod, targetUrl } = props;
    this.props.code = code;
    this.props.name = name;
    this.props.description = description;
    this.props.sourceMethod = sourceMethod;
    this.props.targetMethod = targetMethod;
    this.props.targetUrl = targetUrl;
  }

  public static create(props: CreateIntegrationProps, id?: string): Integration {
    const example = new Integration(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        uniqueCode: props.uniqueCode ?? generateUniqueId(props.code),
      },
      id,
    );
    return example;
  }
}
