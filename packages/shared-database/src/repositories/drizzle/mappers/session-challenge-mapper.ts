import type { session_challenge, tenant } from '../../../../drizzle/schemas/schema'
import { SessionChallenge } from '../../../entities'
import { TenantMapper } from './tenant-mapper'

type SessionChallengePersistence = {
  tenant: typeof tenant.$inferSelect | null
  session_challenge: typeof session_challenge.$inferSelect
}

export class SessionChallengeMapper {
  static toDomain(raw: SessionChallengePersistence[]): SessionChallenge | undefined {
    const persistence = raw[0]

    const { session_challenge: sessionChallengePersistence, tenant: tenantPersistence } = persistence

    if (!sessionChallengePersistence || !tenantPersistence) {
      return undefined
    }

    return SessionChallenge.create(
      {
        tenantCode: tenantPersistence.code,
        sessionIdentifier: sessionChallengePersistence.sessionIdentifier,
        userId: sessionChallengePersistence.userId,
        createdAt: sessionChallengePersistence.createdAt,
        tenant: TenantMapper.toDomain(tenantPersistence),
      },
      sessionChallengePersistence.id,
    )
  }
}
