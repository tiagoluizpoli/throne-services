import { eq, sql } from 'drizzle-orm';
import { session_challenge, tenant } from '../../../drizzle/schemas/schema';
import { db } from '../../client/drizzle';
import type { SessionChallenge } from '../../entities';
import type { GetBySessionIdentifierSessionChallengeRepositoryParams, SessionChallengeRepository } from '../contracts';
import { SessionChallengeMapper } from './mappers';
export class DrizzleSessionChallengeRepository implements SessionChallengeRepository {
  save = async (sessionChallenge: SessionChallenge): Promise<void> => {
    const { id, sessionIdentifier, createdAt, tenantCode, userId } = sessionChallenge;

    const tenantId = sql`(${db.select({ id: tenant.id }).from(tenant).where(eq(tenant.code, tenantCode)).limit(1).getSQL()})`;

    await db
      .insert(session_challenge)
      .values({
        id: id,
        sessionIdentifier: sessionIdentifier,
        tenantId,
        userId: userId,
        createdAt: createdAt,
      })
      .execute();
  };

  getBySessionIdentifier = async (
    params: GetBySessionIdentifierSessionChallengeRepositoryParams,
  ): Promise<SessionChallenge | undefined> => {
    const result = await db
      .select()
      .from(session_challenge)
      .leftJoin(tenant, eq(tenant.id, session_challenge.tenantId))
      .where(eq(session_challenge.sessionIdentifier, params.sessionIdentifier))
      .limit(1)
      .execute();

    return SessionChallengeMapper.toDomain(result);
  };
}
