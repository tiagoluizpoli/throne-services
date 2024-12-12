import type { Session } from '../../../entities';

export interface GetByTokenIdentifierSessionRepositoryParams {
  tokenIdentifier: string;
}

export interface GetByRefreshTokenIdentifierSessionRepositoryParams {
  refreshTokenIdentifier: string;
}

export interface SessionRepository {
  save: (session: Session) => Promise<void>;
  getByTokenIdentifier: (params: GetByTokenIdentifierSessionRepositoryParams) => Promise<Session | undefined>;
  getByRefreshTokenIdentifier: (
    params: GetByRefreshTokenIdentifierSessionRepositoryParams,
  ) => Promise<Session | undefined>;
}
