import 'reflect-metadata'

import { RespondChallengeController } from '@/api'
import { RemoteRespondChallenge } from '@/application'
import {
  ChallengeSessionNotFoundError,
  CodeMismatchError,
  ExpiredCodeError,
  ForbiddenError,
  NotAuthorizedError,
  TooManyRequestsError,
} from '@/domain'
import { faker } from '@faker-js/faker'
import { MockAuthentication, type RespondChallengeAuthParams } from '@solutions/auth'
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

const makeValidSutParams = (override: Partial<RespondChallengeAuthParams> = {}): RespondChallengeAuthParams => ({
  challengeName: faker.helpers.arrayElement(['MFA_SETUP', 'SOFTWARE_TOKEN_MFA']),
  session: initialSessionChallengeIdentifier,
  params: {
    code: faker.string.numeric({ length: 6 }),
    username: initialSessionChallenge.user?.email!,
  },
  ...override,
})

type SutTypes = {
  sut: RespondChallengeController
  respondChallenge: RemoteRespondChallenge
}

const makeSut = (initialSessionChallenges = []): SutTypes => {
  const sessionChallengeRepository = new InMemorySessionChallengeRepository([
    initialSessionChallenge,
    ...initialSessionChallenges,
  ])
  const sessionRepository = new InMemorySessionRepository()
  const authentication = new MockAuthentication()
  const logger = new Logger({ level: 'info' })

  const respondChallenge = new RemoteRespondChallenge(
    sessionChallengeRepository,
    sessionRepository,
    authentication,
    logger,
  )
  const sut = new RespondChallengeController(respondChallenge)
  return {
    sut,
    respondChallenge,
  }
}

describe('RespondChallengeController', () => {
  it.each([
    {
      params: makeValidSutParams({ challengeName: 'MFA_SETUP' }),
    },
    { params: makeValidSutParams({ challengeName: 'SOFTWARE_TOKEN_MFA' }) },
  ])('should return 200 when successfully respond to challenge $params.challengeName', async () => {
    const { sut } = makeSut()

    const result = await sut.handle(makeValidSutParams())

    expect(result.statusCode).toBe(200)
    expect(result.body).toEqual
  })

  it.each([
    {
      params: { ...makeValidSutParams(), challengeName: undefined },
      condition: 'challengeName is empty',
      message: 'The received value for field "challengeName" is invalid. Required',
    },
    {
      params: { ...makeValidSutParams(), challengeName: 'INVALID' },
      condition: 'challengeName is invalid',
      message:
        "The received value for field \"challengeName\" is invalid. Invalid enum value. Expected 'MFA_SETUP' | 'SOFTWARE_TOKEN_MFA', received 'INVALID'",
    },
    {
      params: { ...makeValidSutParams(), session: undefined },
      condition: 'session is empty',
      message: 'The received value for field "session" is invalid. Required',
    },
    {
      params: { ...makeValidSutParams(), session: 10 },
      condition: 'session is invalid',
      message: 'The received value for field "session" is invalid. Expected string, received number',
    },
    {
      params: { ...makeValidSutParams(), params: undefined },
      condition: 'params is empty',
      message: 'The received value for field "params" is invalid. Required',
    },
    {
      params: { ...makeValidSutParams({ challengeName: 'SOFTWARE_TOKEN_MFA' }), params: { code: '12345' } },
      condition: 'SOFTWARE_TOKEN_MFA answered with less then 6 characters',
      message: 'The received value for field "params" is invalid. String must contain at least 6 character(s)',
    },
    {
      params: { ...makeValidSutParams({ challengeName: 'SOFTWARE_TOKEN_MFA' }), params: { code: '1234567' } },
      condition: 'SOFTWARE_TOKEN_MFA answered with more then 6 characters',
      message: 'The received value for field "params" is invalid. String must contain at most 6 character(s)',
    },
    {
      params: { ...makeValidSutParams({ challengeName: 'SOFTWARE_TOKEN_MFA' }), params: {} },
      condition: 'SOFTWARE_TOKEN_MFA answered without code property',
      message: 'The received value for field "params" is invalid. Required',
    },
    {
      params: { ...makeValidSutParams({ challengeName: 'SOFTWARE_TOKEN_MFA' }), params: {} },
      condition: 'MFA_SETUP answered without softwareSession property',
      message: 'The received value for field "params" is invalid. Required',
    },
  ])('should return 400 when $condition', async ({ message, params }) => {
    const { sut } = makeSut()

    // @ts-expect-error: testing purpose
    const result = await sut.handle(params)

    expect(result.statusCode).toBe(400)
    expect(result.body.message).toBe(message)
  })

  it.each([
    { code: 400, respondChallengeError: new CodeMismatchError() },
    { code: 400, respondChallengeError: new ExpiredCodeError() },
    { code: 401, respondChallengeError: new ChallengeSessionNotFoundError() },
    { code: 401, respondChallengeError: new NotAuthorizedError() },
    { code: 401, respondChallengeError: new ForbiddenError() },
    { code: 429, respondChallengeError: new TooManyRequestsError() },
    { code: 500, respondChallengeError: new UnexpectedError() },
  ])(
    'should return $code when respondChallenge left $respondChallengeError.code',
    async ({ code, respondChallengeError }) => {
      const { sut, respondChallenge } = makeSut()
      vi.spyOn(respondChallenge, 'execute').mockResolvedValueOnce(left(respondChallengeError))

      const result = await sut.handle(makeValidSutParams())

      expect(result.statusCode).toBe(code)
    },
  )

  it('should return 500 when respondChallenge throws', async () => {
    const { sut, respondChallenge } = makeSut()
    vi.spyOn(respondChallenge, 'execute').mockImplementationOnce(() => {
      throw new Error()
    })

    const result = await sut.handle(makeValidSutParams())

    expect(result.statusCode).toBe(500)
    expect(result.body.message).toBe('Internal server error')
  })

  it('should return 500 when respondChallenge left a unmapped error', async () => {
    const { sut, respondChallenge } = makeSut()
    // @ts-expect-error: testing unmapped error
    vi.spyOn(respondChallenge, 'execute').mockResolvedValue(left(new Error()))

    const result = await sut.handle(makeValidSutParams())

    expect(result.statusCode).toBe(500)
    expect(result.body.message).toBe('Internal server error')
  })
})
