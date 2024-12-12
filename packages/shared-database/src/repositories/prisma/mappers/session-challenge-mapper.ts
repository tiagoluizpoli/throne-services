import type { Prisma, session_challenge, tenant, tenant_user, user } from '../../../client';
import { SessionChallenge } from '../../../entities';
import { TenantMapper } from './tenant-mapper';
import { UserMapper } from './user-mapper';

type SessionChallengePersistence = session_challenge & {
  tenant: tenant;
  user: user & {
    tenantUser: (tenant_user & {
      tenant: tenant;
    })[];
  };
};

type SessionChallengeCreatePersistence = Prisma.session_challengeCreateInput;

export const SessionChallengeMapper = {
  toDomain: (sessionChallenge: SessionChallengePersistence): SessionChallenge => {
    return SessionChallenge.create(
      {
        sessionIdentifier: sessionChallenge.sessionIdentifier,
        tenantCode: sessionChallenge.tenant.code,
        tenant: TenantMapper.toDomain(sessionChallenge.tenant),
        userId: sessionChallenge.userId,
        user: UserMapper.toDomain(sessionChallenge.user),
        createdAt: sessionChallenge.createdAt,
      },
      sessionChallenge.id,
    );
  },

  toCreatePersistence: (sessionChallenge: SessionChallenge): SessionChallengeCreatePersistence => {
    return {
      id: sessionChallenge.id,
      sessionIdentifier: sessionChallenge.sessionIdentifier,
      tenant: {
        connect: {
          code: sessionChallenge.tenantCode,
        },
      },
      user: {
        connect: {
          id: sessionChallenge.userId,
        },
      },
      createdAt: sessionChallenge.createdAt,
    };
  },
};
