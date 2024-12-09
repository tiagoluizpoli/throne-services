import 'reflect-metadata'
import { RemoteRespondChallenge } from '@/application/usecases'
import {
  ChallengeSessionNotFoundError,
  CodeMismatchError,
  ExpiredCodeError,
  ForbiddenError,
  NotAuthorizedError,
  type RespondChallengeResult,
  TooManyRequestsError,
} from '@/domain'
import { faker } from '@faker-js/faker'
import { MockAuthentication, type RespondChallengeAuthError, type RespondChallengeAuthParams } from '@solutions/auth'
import { getHash } from '@solutions/core/domain'
import { UnexpectedError, left } from '@solutions/core/domain'
import { Logger } from '@solutions/logger'
import { InMemorySessionChallengeRepository, InMemorySessionRepository } from '@solutions/shared-database'
import { mockSessionChallenge } from '@solutions/shared-database/tests'

const initialSessionChallengeIdentifier = faker.string.uuid()
const initialSessionChallenge = mockSessionChallenge({
  sessionChallengeParams: {
    sessionIdentifier: getHash({ content: initialSessionChallengeIdentifier }),
  },
})

const makeValidSutParams = (params: Partial<RespondChallengeAuthParams> = {}): RespondChallengeAuthParams => ({
  challengeName: faker.helpers.arrayElement(['SOFTWARE_TOKEN_MFA', 'MFA_SETUP']),
  session: initialSessionChallengeIdentifier,
  params: {
    code: faker.string.numeric({ length: 6 }),
    username: initialSessionChallenge.user?.email!,
  },
})

type SutTypes = {
  sut: RemoteRespondChallenge
  sessionChallengeRepository: InMemorySessionChallengeRepository
  sessionRepository: InMemorySessionRepository
  authentication: MockAuthentication
}

const makeSut = (initialSessionChallenges = []): SutTypes => {
  const sessionChallengeRepository = new InMemorySessionChallengeRepository([
    initialSessionChallenge,
    ...initialSessionChallenges,
  ])
  const sessionRepository = new InMemorySessionRepository()
  const authentication = new MockAuthentication()
  const logger = new Logger({ level: 'info' })

  const sut = new RemoteRespondChallenge(sessionChallengeRepository, sessionRepository, authentication, logger)
  return {
    sut,
    sessionChallengeRepository,
    sessionRepository,
    authentication,
  }
}

describe('RemoteRespondChallenge', () => {
  it('should left UnexpectedError when session challenge is not found in repository', async () => {
    const { sut } = makeSut()

    const result = await sut.execute({
      ...makeValidSutParams(),
      session: 'inexistent-session',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ChallengeSessionNotFoundError)
  })

  it('should throw when sessionchallengeRepository.getBySessionIdentifier throws', async () => {
    const { sut, sessionChallengeRepository } = makeSut()
    vi.spyOn(sessionChallengeRepository, 'getBySessionIdentifier').mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.execute(makeValidSutParams())

    expect(promise).rejects.toThrow()
  })

  it.each([
    { params: makeValidSutParams({ challengeName: 'MFA_SETUP' }) },
    { params: makeValidSutParams({ challengeName: 'SOFTWARE_TOKEN_MFA' }) },
  ])(
    'should call authentication.respondChallenge with correct params when challengeName is $params.challengeName',
    async ({ params }) => {
      const { sut, authentication } = makeSut()
      const spy = vi.spyOn(authentication, 'respondChallenge')

      await sut.execute(params)

      expect(spy).toHaveBeenCalledWith({
        challengeName: params.challengeName,
        session: params.session,
        params: {
          ...params.params,
          username: expect.any(String),
        },
      })
    },
  )

  it.each([
    { respondChallengeResult: 'CodeMismatchException', expectedError: CodeMismatchError },
    { respondChallengeResult: 'ExpiredCodeException', expectedError: ExpiredCodeError },
    { respondChallengeResult: 'ForbiddenException', expectedError: ForbiddenError },
    { respondChallengeResult: 'NotAuthorizedException', expectedError: NotAuthorizedError },
    { respondChallengeResult: 'TooManyRequestsException', expectedError: TooManyRequestsError },
    { respondChallengeResult: 'UnexpectedException', expectedError: UnexpectedError },
  ])(
    'should left $expectedError.name when authentication returns $respondChallengeResult',
    async ({ respondChallengeResult, expectedError }) => {
      const { sut, authentication } = makeSut()
      vi.spyOn(authentication, 'respondChallenge').mockResolvedValueOnce(
        left(respondChallengeResult as RespondChallengeAuthError),
      )

      const result = await sut.execute(makeValidSutParams())

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(expectedError)
    },
  )

  it('should save new session in repository when authentication returns success', async () => {
    const { sut, sessionRepository } = makeSut()
    const params = makeValidSutParams()

    const result = await sut.execute(params)

    expect(result.isRight()).toBe(true)
    expect(sessionRepository.sessions).toHaveLength(1)
    expect(sessionRepository.sessions[0].tokenIdentifier).toBe(
      getHash({ content: (result.value as RespondChallengeResult).token }),
    )
    expect(sessionRepository.sessions[0].userId).toBe(initialSessionChallenge.userId)
    expect(sessionRepository.sessions[0].tenantCode).toBe(initialSessionChallenge.tenantCode)
  })

  it('should return right with authentication response when authentication returns success', async () => {
    const { sut, sessionRepository } = makeSut()

    const result = await sut.execute(makeValidSutParams())

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      token: expect.any(String),
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    })
  })
})
