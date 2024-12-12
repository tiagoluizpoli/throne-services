import type { GetByFieldRepositoryParams } from '@solutions/core/application';
import { prisma } from '../../client';
import type { User } from '../../entities';
import type { UsersRepository } from '../contracts';
import { UserMapper } from './mappers';

export class PrismaUsersRepository implements UsersRepository {
  async getByField({ tenantCode, field, value }: GetByFieldRepositoryParams): Promise<User | undefined> {
    const userPersistence = await prisma.user.findFirst({
      where: {
        [field]: value,
        tenantUser: {
          some: {
            tenant: {
              code: tenantCode,
            },
          },
        },
      },
      include: {
        tenantUser: {
          include: {
            tenant: true,
          },
        },
      },
    });

    if (!userPersistence) {
      return;
    }

    return UserMapper.toDomain(userPersistence);
  }

  async getByEmail(email: string): Promise<User | undefined> {
    const userPersistence = await prisma.user.findFirst({
      where: {
        email,
      },
      include: {
        tenantUser: {
          include: {
            tenant: true,
          },
        },
      },
    });

    if (!userPersistence) {
      return;
    }

    return UserMapper.toDomain(userPersistence);
  }
}
