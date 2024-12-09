import { prisma } from '../../client'
import type { Session } from '../../entities'
import type {
  GetByRefreshTokenIdentifierSessionRepositoryParams,
  GetByTokenIdentifierSessionRepositoryParams,
  SessionRepository,
} from '../contracts'
import { SessionMapper } from './mappers'

export class PrismaSessionRepository implements SessionRepository {
  save = async (session: Session): Promise<void> => {
    await prisma.session.create({
      data: SessionMapper.toCreatePersistence(session),
    })
  }

  getByTokenIdentifier = async ({
    tokenIdentifier,
  }: GetByTokenIdentifierSessionRepositoryParams): Promise<Session | undefined> => {
    const session = await prisma.session.findFirst({
      where: {
        tokenIdentifier,
      },
      include: {
        tenant: true,
        user: {
          include: {
            tenantUser: {
              include: {
                tenant: true,
              },
            },
          },
        },
      },
    })

    if (!session) {
      return undefined
    }

    return SessionMapper.toDomain(session)
  }

  getByRefreshTokenIdentifier = async ({
    refreshTokenIdentifier,
  }: GetByRefreshTokenIdentifierSessionRepositoryParams): Promise<Session | undefined> => {
    const session = await prisma.session.findFirst({
      where: {
        refreshTokenIdentifier,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        tenant: true,
        user: {
          include: {
            tenantUser: {
              include: {
                tenant: true,
              },
            },
          },
        },
      },
    })

    if (!session) {
      return undefined
    }

    return SessionMapper.toDomain(session)
  }
}
