import { Entity } from '@solutions/core/domain';
import type { Tenant } from './tenant';
import type { User } from './user';

interface SessionChallengeProps {
  sessionIdentifier: string;
  tenantCode: string;
  tenant?: Tenant;
  userId: string;
  user?: User;
  createdAt: Date;
}

export class SessionChallenge extends Entity<SessionChallengeProps> {
  get sessionIdentifier(): string {
    return this.props.sessionIdentifier;
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

  private constructor(props: SessionChallengeProps, id?: string) {
    super(props, id);
  }

  public static create(props: SessionChallengeProps, id?: string): SessionChallenge {
    return new SessionChallenge(props, id);
  }
}
