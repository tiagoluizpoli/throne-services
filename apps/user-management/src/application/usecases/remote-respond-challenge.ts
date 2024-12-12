import { challengeErrorMapper } from '@/application/contracts';
import {
  ChallengeSessionNotFoundError,
  type RespondChallenge,
  type RespondChallengeError,
  type RespondChallengeParams,
  type RespondChallengeResult,
} from '@/domain';
import { injectionTokens } from '@/main/di';
import type { Authentication } from '@solutions/auth';
import { getHash } from '@solutions/core/domain';
import { type Either, left, right } from '@solutions/core/domain';
import type { Logger } from '@solutions/logger';
import { Session, type SessionChallengeRepository, type SessionRepository } from '@solutions/shared-database';
import { inject, injectable } from 'tsyringe';

const { infraestructure, global } = injectionTokens;

@injectable()
export class RemoteRespondChallenge implements RespondChallenge {
  constructor(
    @inject(infraestructure.sessionChallengeRepository)
    private readonly sessionchallengeRepository: SessionChallengeRepository,
    @inject(infraestructure.sessionRepository) private readonly sessionRepository: SessionRepository,
    @inject(infraestructure.authentication) private readonly authentication: Authentication,
    @inject(global.logger) private readonly logger: Logger,
  ) {}

  async execute({
    session,
    params,
    challengeName,
  }: RespondChallengeParams): Promise<Either<RespondChallengeError, RespondChallengeResult>> {
    this.logger.info(
      `RemoteRespondChallenge.execute :: getting challenge session ${getHash({ content: session })} from database`,
    );
    const challengeSession = await this.sessionchallengeRepository.getBySessionIdentifier({
      sessionIdentifier: getHash({ content: session }),
    });

    if (!challengeSession) {
      this.logger.error('RemoteRespondChallenge.execute :: Challenge session not found');
      return left(new ChallengeSessionNotFoundError());
    }

    this.logger.info(`RemoteRespondChallenge.execute :: responding challenge ${challengeName} for session`);
    const respondChallengeResult = await this.authentication.respondChallenge({
      challengeName,
      session,
      params: {
        ...params,
        username: challengeSession.user?.email!,
      },
    });

    if (respondChallengeResult.isLeft()) {
      this.logger.error(`RemoteRespondChallenge.execute :: Error responding challenge ${challengeName}`, {
        errorCode: respondChallengeResult.value,
      });
      return left(challengeErrorMapper[respondChallengeResult.value]);
    }

    const challengeResult = respondChallengeResult.value;
    this.logger.info(`RemoteRespondChallenge.execute :: challenge ${challengeName} responded successfully`);

    const newSession = Session.create({
      tenantCode: challengeSession.tenantCode,
      userId: challengeSession.userId,
      tokenIdentifier: getHash({ content: challengeResult.token }),
      refreshTokenIdentifier: getHash({ content: challengeResult.refreshToken }),
      createdAt: new Date(),
    });

    this.logger.info('RemoteRespondChallenge.execute :: save new session to database');
    await this.sessionRepository.save(newSession);

    this.logger.info('RemoteRespondChallenge.execute :: session saved successfully');
    return right(respondChallengeResult.value);
  }
}
