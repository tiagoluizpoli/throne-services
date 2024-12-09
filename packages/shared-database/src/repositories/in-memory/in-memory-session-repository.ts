import type { Session } from '../../entities'
import type {
  GetByRefreshTokenIdentifierSessionRepositoryParams,
  GetByTokenIdentifierSessionRepositoryParams,
  SessionRepository,
} from '../contracts'

export class InMemorySessionRepository implements SessionRepository {
  constructor(public readonly sessions: Session[] = []) {}

  save = async (session: Session): Promise<void> => {
    this.sessions.push(session)
  }

  getByTokenIdentifier = async ({
    tokenIdentifier,
  }: GetByTokenIdentifierSessionRepositoryParams): Promise<Session | undefined> => {
    return this.sessions.find((session) => session.tokenIdentifier === tokenIdentifier)
  }

  getByRefreshTokenIdentifier = async (
    params: GetByRefreshTokenIdentifierSessionRepositoryParams,
  ): Promise<Session | undefined> => {
    return this.sessions
      .filter((session) => session.refreshTokenIdentifier === params.refreshTokenIdentifier)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0]
  }
}
