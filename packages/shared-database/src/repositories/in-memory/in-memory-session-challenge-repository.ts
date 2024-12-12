import type { SessionChallenge } from '../../entities';
import type { GetBySessionIdentifierSessionChallengeRepositoryParams, SessionChallengeRepository } from '../contracts';

export class InMemorySessionChallengeRepository implements SessionChallengeRepository {
  constructor(public readonly sessionChallenges: SessionChallenge[] = []) {}

  save = async (sessionChallenge: SessionChallenge): Promise<void> => {
    this.sessionChallenges.push(sessionChallenge);
  };

  getBySessionIdentifier = async ({
    sessionIdentifier,
  }: GetBySessionIdentifierSessionChallengeRepositoryParams): Promise<SessionChallenge | undefined> => {
    return this.sessionChallenges.find((sessionChallenge) => sessionChallenge.sessionIdentifier === sessionIdentifier);
  };
}
