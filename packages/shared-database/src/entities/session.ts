import { Entity } from '@solutions/core/domain';
import type { Tenant } from './tenant';
import type { User } from './user';

interface SessionProps {
  tokenIdentifier: string;
  refreshTokenIdentifier: string;
  tenantCode: string;
  tenant?: Tenant;
  userId: string;
  user?: User;
  createdAt: Date;
}

export class Session extends Entity<SessionProps> {
  get tokenIdentifier(): string {
    return this.props.tokenIdentifier;
  }

  get refreshTokenIdentifier(): string {
    return this.props.refreshTokenIdentifier;
  }

  get tenantCode(): string {
    return this.props.tenantCode;
  }

  get tenant(): Tenant | undefined {
    return this.props.tenant;
  }

  get userId(): string {
    return this.props.userId;
  }

  get user(): User | undefined {
    return this.props.user;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  private constructor(props: SessionProps, id?: string) {
    super(props, id);
  }

  public static create(props: SessionProps, id?: string): Session {
    return new Session(props, id);
  }
}
