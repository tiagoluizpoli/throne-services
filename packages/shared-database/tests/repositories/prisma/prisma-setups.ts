import { PrismaClient } from '@prisma/shared-database/client'

import { SessionMapper } from '../../../src'
import type { Session, SessionChallenge, Tenant, User } from '../../../src/entities'

const prisma = new PrismaClient()

type UserAndTenants = {
  user: User
  tenants: Tenant[]
}

export const insertUserAndTenants = async ({ user, tenants }: UserAndTenants) => {
  const tenantUserCreate = tenants.map((tenant) => ({
    tenant: {
      create: {
        id: tenant.id,
        code: tenant.code,
        name: tenant.name,
        description: tenant.description,
        apikey: tenant.apiKey,
        createdAt: tenant.createdAt,
      },
    },
  }))

  await prisma.user.create({
    data: {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      tenantUser: {
        create: tenantUserCreate,
      },
    },
  })

  return { user, tenants }
}

export const deleteUsersAndTenants = async ({ user, tenants }: UserAndTenants) => {
  await prisma.tenant_user.deleteMany({
    where: {
      user: {
        email: user.email,
      },
    },
  })

  await prisma.user.delete({
    where: {
      email: user.email,
    },
  })

  await prisma.tenant.deleteMany({
    where: {
      code: {
        in: tenants.map((tenant) => tenant.code),
      },
    },
  })
}

export const insertSessions = async (sessions: Session[]) => {
  await prisma.session.createMany({
    data: sessions.map((session) => ({
      id: session.id,
      tokenIdentifier: session.tokenIdentifier,
      refreshTokenIdentifier: session.refreshTokenIdentifier,
      tenantId: session.tenant?.id!,
      userId: session.userId,
      createdAt: session.createdAt,
    })),
  })
}

export const deleteSessions = async (tenant: Tenant) => {
  await prisma.session.deleteMany({
    where: {
      tenantId: tenant.id,
    },
  })
}

export const getSessions = async (sessions: Session[]) => {
  const fetchedSessions = await prisma.session.findMany({
    where: {
      id: {
        in: sessions.map((session) => session.id),
      },
    },
    include: {
      tenant: true,
      user: {
        include: {
          tenantUser: {
            include: {
              tenant: true,
            },
          },
        },
      },
    },
  })

  return fetchedSessions.map((session) => SessionMapper.toDomain(session))
}

export const insertSessionChallenges = async (sessionChallenges: SessionChallenge[]) => {
  await prisma.session_challenge.createMany({
    data: sessionChallenges.map((sessionChallenge) => ({
      id: sessionChallenge.id,
      sessionIdentifier: sessionChallenge.sessionIdentifier,
      tenantId: sessionChallenge.tenant?.id!,
      userId: sessionChallenge.userId,
      createdAt: sessionChallenge.createdAt,
    })),
  })
}

export const deleteSessionChallenges = async (tenant: Tenant) => {
  await prisma.session_challenge.deleteMany({
    where: {
      tenantId: tenant.id,
    },
  })
}

export const getSessionChallenges = async (sessionChallenges: SessionChallenge[]) => {
  const fetchedSessionChallenges = await prisma.session_challenge.findMany({
    where: {
      id: {
        in: sessionChallenges.map((sessionChallenge) => sessionChallenge.id),
      },
    },
    include: {
      tenant: true,
    },
  })

  return fetchedSessionChallenges
}
