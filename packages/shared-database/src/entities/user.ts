import { Entity } from '@solutions/core/domain';
import type { Tenant } from './tenant';

interface UserProps {
  name: string;
  email: string;
  createdAt: Date;
  tenants: Tenant[];
}

export class User extends Entity<UserProps> {
  private constructor(props: UserProps, id?: string) {
    super(props, id);
  }

  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get tenants(): Tenant[] {
    return this.props.tenants;
  }

  public static create(props: UserProps, id?: string): User {
    const user = new User(props, id);
    return user;
  }
}
