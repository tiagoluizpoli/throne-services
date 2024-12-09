import 'reflect-metadata'

import { PrismaSessionRepository, Session, prisma } from '../../../src'
import { mockSession, mockTenant, mockUser } from '../../mocks'
import {
  deleteSessions,
  deleteUsersAndTenants,
  getSessions,
  insertSessions,
  insertUserAndTenants,
} from './prisma-setups'

const tenant = mockTenant()
const user = mockUser({ tenants: [tenant] })
const sessions = [mockSession({ tenant, user }), mockSession({ tenant, user })]

type SutTypes = {
  sut: PrismaSessionRepository
}
const makeSut = (): SutTypes => {
  const sut = new PrismaSessionRepository()
  return { sut }
}

describe('prisma-session-repository', () => {
  beforeAll(async () => {
    await insertUserAndTenants({ user, tenants: [tenant] })
  })

  afterAll(async () => {
    await deleteUsersAndTenants({ user, tenants: [tenant] })
  })
  describe('save', () => {
    afterAll(async () => {
      await deleteSessions(tenant)
    })
    it('should save a session to the database', async () => {
      const { sut } = makeSut()

      const session = sessions[0]

      await sut.save(session)

      const fetchedSessions = await getSessions(sessions)
      const savedSession = fetchedSessions.find(
        (fetchedSession) => fetchedSession.tokenIdentifier === session.tokenIdentifier,
      )

      expect(savedSession).toEqual(
        expect.objectContaining({
          tokenIdentifier: session.tokenIdentifier,
          tenantCode: session.tenantCode,
          userId: session.userId,
        }),
      )
    })

    it('should throw when prisma throws', async () => {
      const { sut } = makeSut()
      vi.spyOn(prisma.session, 'create').mockImplementation(() => {
        throw new Error()
      })

      const promise = sut.save(sessions[0])

      await expect(promise).rejects.toThrow()
    })
  })

  describe('getByTokenIdentifier', () => {
    beforeAll(async () => {
      await insertSessions(sessions)
    })
    afterAll(async () => {
      await deleteSessions(tenant)
    })

    it('should return a session by tokenIdentifier', async () => {
      const { sut } = makeSut()

      const session = sessions[0]

      const result = await sut.getByTokenIdentifier({
        tokenIdentifier: session.tokenIdentifier,
      })

      expect(result).toBeInstanceOf(Session)
      expect(result).not.toBeUndefined()
      expect(result).toEqual(sessions[0])
    })

    it('should return undefined when session not found', async () => {
      const { sut } = makeSut()

      const result = await sut.getByTokenIdentifier({
        tokenIdentifier: 'not-found',
      })

      expect(result).toBeUndefined()
    })

    it('should throw when prisma throws', async () => {
      const { sut } = makeSut()
      vi.spyOn(prisma.session, 'findFirst').mockImplementation(() => {
        throw new Error()
      })

      const promise = sut.getByTokenIdentifier({
        tokenIdentifier: sessions[0].tokenIdentifier,
      })

      await expect(promise).rejects.toThrow()
    })
  })
})
