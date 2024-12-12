import type { GetByFieldRepository } from '@solutions/core/application';
import type { User } from '../../../entities';

export interface UsersRepository extends GetByFieldRepository<User> {
  getByEmail: (email: string) => Promise<User | undefined>;
}
