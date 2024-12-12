import {
  PreviousSessionNotFoundError,
  type RefreshToken,
  type RefreshTokenError,
  type RefreshTokenParams,
  type RefreshTokenResult,
} from '@/domain';
import { injectionTokens } from '@/main/di/injection-tokens';
import type { Authentication } from '@solutions/auth';
import { type Either, getHash, left, right } from '@solutions/core/domain';
import type { Logger } from '@solutions/logger';
import { Session, type SessionRepository } from '@solutions/shared-database';
import { inject, injectable } from 'tsyringe';
import { authenticationErrorMapper } from '../contracts';

const { global, infraestructure } = injectionTokens;

@injectable()
export class RemoteRefreshToken implements RefreshToken {
  constructor(
    @inject(infraestructure.authentication) private readonly authentication: Authentication,

    @inject(infraestructure.sessionRepository) private readonly sessionRepository: SessionRepository,
    @inject(global.logger) private readonly logger: Logger,
  ) {}

  async execute({ refreshToken }: RefreshTokenParams): Promise<Either<RefreshTokenError, RefreshTokenResult>> {
    const hashedRefreshToken = getHash({ content: refreshToken });

    this.logger.info('RemoteRefreshToken.execute :: Fetching previous session using hashedRefreshToken', {
      hashedRefreshToken,
    });
    const previousSession = await this.sessionRepository.getByRefreshTokenIdentifier({
      refreshTokenIdentifier: hashedRefreshToken,
    });

    if (!previousSession) {
      this.logger.error('RemoteRefreshToken.execute :: Previous session not found', {
        hashedRefreshTokenIdentifier: hashedRefreshToken,
      });
      return left(new PreviousSessionNotFoundError());
    }

    this.logger.info('RemoteRefreshToken.execute :: Calling authentication.refreshToken');
    const refreshTokenResult = await this.authentication.refreshToken(refreshToken);

    if (refreshTokenResult.isLeft()) {
      this.logger.error('RemoteRefreshToken.execute :: authentication.refreshToken :: Authentication failed', {
        errorCode: refreshTokenResult.value,
      });
      return left(authenticationErrorMapper[refreshTokenResult.value]);
    }

    const refreshedTokens = refreshTokenResult.value;

    const hashedToken = getHash({ content: refreshedTokens.token });
    this.logger.debug('RemoteRefreshToken.execute :: Hashed token', { hashedToken });

    const session = Session.create({
      tenantCode: previousSession.tenantCode,
      userId: previousSession.userId,
      tokenIdentifier: hashedToken,
      refreshTokenIdentifier: hashedRefreshToken,
      createdAt: new Date(),
    });

    await this.sessionRepository.save(session);
    this.logger.debug('RemoteRefreshToken.execute :: Session created in database', { sessionId: session.id });

    return right(refreshedTokens);
  }
}
