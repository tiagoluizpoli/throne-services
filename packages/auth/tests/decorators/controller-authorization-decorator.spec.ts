import 'reflect-metadata'

import type { Controller, HttpResponse } from '@solutions/core/api'
import type { InMemorySessionRepository } from '@solutions/shared-database'
import { mockSession, mockUser } from '@solutions/shared-database/tests'
import { type Authentication, controllerAuthorizationHandling } from '../../src'

import { right } from '@solutions/core/domain'
import { mockToken, setupMocks } from '../mocks'
import { resolveDependencies, setupDependencies } from './setup-dependencies'

const {
  tokens: { correctToken, secondaryCorrectToken },
  tenant,
  user,
  groups,
  session,
} = setupMocks()

setupDependencies({
  tokenParams: [
    { verifiedToken: correctToken.token, email: user.email, groups },
    { verifiedToken: secondaryCorrectToken.token, email: user.email, groups },
  ],
  user,
  groups,
})

type SutTypes = {
  sut: Controller
  authentication: Authentication
  sessionRepository: InMemorySessionRepository
}
const makeSut = (): SutTypes => {
  const { authentication, sessionRepository } = resolveDependencies()

  @controllerAuthorizationHandling({
    serviceName: 'test-service',
    sessionRepositoryToken: 'SessionRepository',
    authenticationToken: 'Authentication',
  })
  class MockedClass implements Controller {
    async handle(request: any): Promise<HttpResponse> {
      return {
        statusCode: 200,
        body: {
          message: 'mocked class was successfully handled',
          tenant: request.tenant,
          user: request.user,
        },
      }
    }
  }
  return {
    sut: new MockedClass(),
    authentication,
    sessionRepository,
  }
}

describe('controller-authorization-decorator', () => {
  beforeAll(() => {
    const { sessionRepository } = resolveDependencies()
    sessionRepository.sessions.push(session)
  })
  it('should return 401 when no token provided', async () => {
    const { sut } = makeSut()

    const response = await sut.handle({})

    expect(response.statusCode).toBe(401)
  })

  it('should throw if authentication.verify throws', async () => {
    const { sut, authentication } = makeSut()
    const spy = vi.spyOn(authentication, 'verify').mockImplementationOnce(() => {
      throw new Error('error')
    })

    const promise = sut.handle({ authorizationToken: correctToken.token })

    await expect(promise).rejects.toThrow()
    expect(spy).toHaveBeenCalledWith(correctToken.token)
  })

  it('should return 401 when invalid token provided', async () => {
    const { sut, authentication } = makeSut()

    const tokenVerifySpy = vi.spyOn(authentication, 'verify')

    const invalidToken = mockToken('invalid-token')

    const response = await sut.handle({ authorizationToken: invalidToken.token })

    expect(tokenVerifySpy).toHaveBeenCalledWith(invalidToken.token)
    expect(response.statusCode).toBe(401)
  })

  it('should return 401 when session not found', async () => {
    const { sut, sessionRepository } = makeSut()
    const sessionRepositorySpy = vi.spyOn(sessionRepository, 'getByTokenIdentifier')

    const response = await sut.handle({ authorizationToken: secondaryCorrectToken.token })

    expect(sessionRepositorySpy).toHaveBeenCalledWith({ tokenIdentifier: secondaryCorrectToken.hashedToken })

    expect(response.statusCode).toBe(401)
  })

  it('should throw 500 if sessionRepository throws', async () => {
    const { sut, sessionRepository } = makeSut()
    const sessionRepositorySpy = vi.spyOn(sessionRepository, 'getByTokenIdentifier').mockImplementationOnce(() => {
      throw new Error('error')
    })

    const promise = sut.handle({ authorizationToken: correctToken.token })

    await expect(promise).rejects.toThrow()
    expect(sessionRepositorySpy).toHaveBeenCalledWith({ tokenIdentifier: correctToken.hashedToken })
  })

  it('should return 401 when user not associated with the tenant', async () => {
    const { sut, sessionRepository } = makeSut()
    const sessionRepositorySpy = vi.spyOn(sessionRepository, 'getByTokenIdentifier')

    const tenantlessUser = mockUser({ tenants: [] })

    const session = mockSession({
      sessionParams: { tokenIdentifier: secondaryCorrectToken.token },
      tenant,
      user: tenantlessUser,
    })

    sessionRepository.sessions.push(session)

    const response = await sut.handle({ authorizationToken: secondaryCorrectToken.token })

    expect(sessionRepositorySpy).toHaveBeenCalledWith({ tokenIdentifier: secondaryCorrectToken.hashedToken })
    expect(response.statusCode).toBe(401)
  })

  it('should return 401 when user email and session email do not match', async () => {
    const { sut, authentication } = makeSut()
    vi.spyOn(authentication, 'verify').mockResolvedValueOnce(
      right({
        email: 'different-email@example.com',
        groups,
      }),
    )

    const response = await sut.handle({ authorizationToken: correctToken.token })

    expect(session?.user?.email).not.toBe('different-email@example.com')
    expect(response.statusCode).toBe(401)
  })

  it('should return 401 when user not allowed to perform actions on the service', async () => {
    const { sut, authentication, sessionRepository } = makeSut()
    vi.spyOn(authentication, 'verify').mockResolvedValueOnce(
      right({
        email: user.email,
        groups: ['different-service'],
      }),
    )
    const consoleSpy = vi.spyOn(console, 'info')

    const response = await sut.handle({ authorizationToken: correctToken.token })

    expect(consoleSpy).toHaveBeenCalledWith('user not allowed to perform actions on test-service service')
    expect(response.statusCode).toBe(401)
  })

  it('should return 200 when valid token provided', async () => {
    const { sut, authentication } = makeSut()
    vi.spyOn(authentication, 'verify').mockResolvedValueOnce(
      right({
        email: user.email,
        groups,
      }),
    )

    const response = await sut.handle({ authorizationToken: correctToken.token })

    expect(response).toEqual({
      statusCode: 200,
      body: {
        message: 'mocked class was successfully handled',
        tenant: tenant.code,
        user: user.id,
      },
    })
  })

  it('should inject tenant and user into request', async () => {
    const { sut } = makeSut()

    const response = await sut.handle({ authorizationToken: correctToken.token })

    expect(response).toEqual({
      statusCode: 200,
      body: {
        message: 'mocked class was successfully handled',
        tenant: tenant.code,
        user: user.id,
      },
    })
  })
})
