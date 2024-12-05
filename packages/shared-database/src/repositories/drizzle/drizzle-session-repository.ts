import { eq, sql } from 'drizzle-orm'
import { session, tenant, user } from '../../../drizzle/schemas/schema'
import { db } from '../../client/drizzle'
import type { Session } from '../../entities'
import type {
  GetByRefreshTokenIdentifierSessionRepositoryParams,
  GetByTokenIdentifierSessionRepositoryParams,
  SessionRepository,
} from '../contracts'
import { SessionMapper } from './mappers'

export class DrizzleSessionRepository implements SessionRepository {
  save = async (params: Session): Promise<void> => {
    const tenantId = sql`(${db.select({ id: tenant.id }).from(tenant).where(eq(tenant.code, params.tenantCode)).limit(1).getSQL()})`
    const userId = sql`(${db.select({ id: user.id }).from(user).where(eq(user.id, params.userId)).limit(1).getSQL()})`

    await db
      .insert(session)
      .values({
        id: params.id,
        tokenIdentifier: params.tokenIdentifier,
        refreshTokenIdentifier: params.refreshTokenIdentifier,
        tenantId,
        userId,
        createdAt: params.createdAt,
      })
      .execute()
  }

  getByTokenIdentifier = async ({
    tokenIdentifier,
  }: GetByTokenIdentifierSessionRepositoryParams): Promise<Session | undefined> => {
    const result = await db
      .select()
      .from(session)
      .leftJoin(tenant, eq(tenant.id, session.tenantId))
      .where(eq(session.tokenIdentifier, tokenIdentifier))
      .limit(1)
      .execute()

    return SessionMapper.toDomain(result)
  }

  getByRefreshTokenIdentifier = async (
    params: GetByRefreshTokenIdentifierSessionRepositoryParams,
  ): Promise<Session | undefined> => {
    const result = await db
      .select()
      .from(session)
      .leftJoin(tenant, eq(tenant.id, session.tenantId))
      .where(eq(session.refreshTokenIdentifier, params.refreshTokenIdentifier))
      .limit(1)
      .execute()

    return SessionMapper.toDomain(result)
  }
}
