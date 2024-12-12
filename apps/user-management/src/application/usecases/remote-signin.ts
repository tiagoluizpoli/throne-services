import { authenticationErrorMapper } from '@/application/contracts';
import {
  type Signin,
  type SigninError,
  type SigninParams,
  type SigninResult,
  UserHasMultipleTenantsError,
  UserNotFoundError,
} from '@/domain/usecases';
import { injectionTokens } from '@/main/di';
import type { Authentication } from '@solutions/auth';
import { type Either, left, right } from '@solutions/core/domain';
import { getHash } from '@solutions/core/domain';
import type { Logger } from '@solutions/logger';
import {
  Session,
  SessionChallenge,
  type SessionChallengeRepository,
  type SessionRepository,
  type UsersRepository,
} from '@solutions/shared-database';
import { inject, injectable } from 'tsyringe';

const { global, infraestructure } = injectionTokens;

type InternalSigninParams = {
  tenantCode: string;
  userId: string;
  email: string;
  password: string;
};

@injectable()
export class RemoteSignin implements Signin {
  constructor(
    @inject(infraestructure.authentication) private readonly authentication: Authentication,
    @inject(infraestructure.usersRepository) private readonly usersRepository: UsersRepository,
    @inject(infraestructure.sessionRepository) private readonly sessionRepository: SessionRepository,
    @inject(infraestructure.sessionChallengeRepository)
    private readonly sessionChallengeRepository: SessionChallengeRepository,
    @inject(global.logger) private readonly logger: Logger,
  ) {}

  async execute(params: SigninParams): Promise<Either<SigninError, SigninResult>> {
    const { email, password, mfaRequired } = params;

    let tenantCode = params.tenantCode ?? '';

    console.log('provided tenantCode', tenantCode);

    // TODO: remove this when tenantCode is required
    if (!params.tenantCode) {
      this.logger.info(`RemoteSignin.execute :: Tenant code not provided for user ${email}`);
      const user = await this.usersRepository.getByEmail(email);

      if (!user) {
        this.logger.error('RemoteSignin.execute :: User not found in database', { email });
        return left(new UserNotFoundError());
      }

      if (!user?.tenants || user?.tenants.length > 1 || user?.tenants.length === 0) {
        this.logger.error('RemoteSignin.execute :: User has multiple tenants', { email: params.email });
        return left(new UserHasMultipleTenantsError());
      }

      this.logger.info(`RemoteSignin.execute :: Using tenant code from user ${user?.tenants[0].code}`);
      tenantCode = user?.tenants[0].code;
    }

    const user = await this.usersRepository.getByField({ tenantCode, field: 'email', value: email });

    if (!user) {
      this.logger.error('RemoteSignin.execute :: User not found in database', { email });
      return left(new UserNotFoundError());
    }

    if (mfaRequired) {
      return this.initSignin({ tenantCode, userId: user.id, email, password });
    }

    return this.signin({ tenantCode, userId: user.id, email, password });
  }

  private async initSignin({
    tenantCode,
    userId,
    email,
    password,
  }: InternalSigninParams): Promise<Either<SigninError, SigninResult>> {
    const authResult = await this.authentication.initSignin({ email, password });

    if (authResult.isLeft()) {
      this.logger.error('RemoteSignin.execute :: initSignin :: Authentication failed', {
        errorCode: authResult.value,
      });
      return left(authenticationErrorMapper[authResult.value]);
    }

    const auth = authResult.value;

    const hashedSession = getHash({ content: auth.session });
    this.logger.debug('RemoteSignin.execute :: initSignin :: Hashed session', { hashedSession });

    const sessionChallenge = SessionChallenge.create({
      tenantCode,
      userId,
      sessionIdentifier: hashedSession,
      createdAt: new Date(),
    });

    await this.sessionChallengeRepository.save(sessionChallenge);
    this.logger.debug('RemoteSignin.execute :: initSignin :: Session challenge created in database', {
      sessionChallengeId: sessionChallenge.id,
    });

    return right(auth);
  }

  private async signin({
    tenantCode,
    userId,
    email,
    password,
  }: InternalSigninParams): Promise<Either<SigninError, SigninResult>> {
    const authResult = await this.authentication.signin({ email, password });

    if (authResult.isLeft()) {
      this.logger.error('RemoteSignin.execute :: signin :: Authentication failed', { errorCode: authResult.value });
      return left(authenticationErrorMapper[authResult.value]);
    }

    const auth = authResult.value;

    const hashedToken = getHash({ content: auth.token });
    const hashedRefreshToken = getHash({ content: auth.refreshToken });

    this.logger.debug('RemoteSignin.execute :: signin :: Hashed token and refreshToken', {
      hashedToken,
      hashedRefreshToken,
    });

    const session = Session.create({
      tenantCode,
      userId,
      tokenIdentifier: hashedToken,
      refreshTokenIdentifier: hashedRefreshToken,
      createdAt: new Date(),
    });

    await this.sessionRepository.save(session);
    this.logger.debug('RemoteSignin.execute :: signin :: Session created in database', { sessionId: session.id });

    return right(auth);
  }
}
