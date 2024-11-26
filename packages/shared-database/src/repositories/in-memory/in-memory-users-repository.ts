import type { GetByFieldRepositoryParams } from '@solutions/core/application'
import type { User } from '../../entities'
import type { UsersRepository } from '../contracts'

export class InMemoryUsersRepository implements UsersRepository {
  constructor(readonly users: User[] = []) {}

  async getByField({ tenantCode, field, value }: GetByFieldRepositoryParams): Promise<User | undefined> {
    return this.users.find(
      (user) => user[field as keyof User] === value && user.tenants.some((t) => t.code === tenantCode),
    )
  }
  async getByEmail(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email)
  }
}
