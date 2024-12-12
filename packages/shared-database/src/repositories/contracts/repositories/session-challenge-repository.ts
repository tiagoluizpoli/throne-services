import type { SessionChallenge } from '../../../entities';

export interface GetBySessionIdentifierSessionChallengeRepositoryParams {
  sessionIdentifier: string;
}

export interface SessionChallengeRepository {
  save: (sessionChallenge: SessionChallenge) => Promise<void>;
  getBySessionIdentifier: (
    params: GetBySessionIdentifierSessionChallengeRepositoryParams,
  ) => Promise<SessionChallenge | undefined>;
}
