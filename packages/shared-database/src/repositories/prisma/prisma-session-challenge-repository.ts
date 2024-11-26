import { prisma } from '../../client'
import type { SessionChallenge } from '../../entities/session-challenge'
import type { GetBySessionIdentifierSessionChallengeRepositoryParams, SessionChallengeRepository } from '../contracts'
import { SessionChallengeMapper } from './mappers'

export class PrismaSessionChallengeRepository implements SessionChallengeRepository {
  save = async (sessionChallenge: SessionChallenge): Promise<void> => {
    await prisma.session_challenge.create({
      data: SessionChallengeMapper.toCreatePersistence(sessionChallenge),
    })
  }

  getBySessionIdentifier = async ({
    sessionIdentifier,
  }: GetBySessionIdentifierSessionChallengeRepositoryParams): Promise<SessionChallenge | undefined> => {
    const sessionChallenge = await prisma.session_challenge.findFirst({
      where: {
        sessionIdentifier,
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

    if (!sessionChallenge) {
      return undefined
    }

    return SessionChallengeMapper.toDomain(sessionChallenge)
  }
}
