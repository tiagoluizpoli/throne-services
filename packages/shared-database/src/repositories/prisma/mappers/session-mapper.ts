import type { Prisma, session, tenant, tenant_user, user } from '../../../client'
import { Session } from '../../../entities'
import { TenantMapper } from './tenant-mapper'
import { UserMapper } from './user-mapper'

type SessionPersistence = session & {
  tenant: tenant
  user: user & {
    tenantUser: (tenant_user & {
      tenant: tenant
    })[]
  }
}

type SessionCreatePersistence = Prisma.sessionCreateInput

export const SessionMapper = {
  toDomain: (session: SessionPersistence): Session => {
    return Session.create(
      {
        tokenIdentifier: session.tokenIdentifier,
        refreshTokenIdentifier: session.refreshTokenIdentifier,
        tenantCode: session.tenant.code,
        tenant: TenantMapper.toDomain(session.tenant),
        userId: session.userId,
        user: UserMapper.toDomain(session.user),
        createdAt: session.createdAt,
      },
      session.id,
    )
  },

  toCreatePersistence: (session: Session): SessionCreatePersistence => {
    return {
      id: session.id,
      tokenIdentifier: session.tokenIdentifier,
      refreshTokenIdentifier: session.refreshTokenIdentifier,
      tenant: {
        connect: {
          code: session.tenantCode,
        },
      },
      user: {
        connect: {
          id: session.userId,
        },
      },
      createdAt: session.createdAt,
    }
  },
}
