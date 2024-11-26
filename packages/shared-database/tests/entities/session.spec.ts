import { faker } from '@faker-js/faker'
import { Session } from '../../src/entities'

describe('Session', () => {
  it('should create a session', () => {
    const session = Session.create({
      tokenIdentifier: faker.string.alphanumeric(10),
      refreshTokenIdentifier: faker.string.alphanumeric(10),
      tenantCode: faker.string.alphanumeric(5),
      userId: faker.string.alphanumeric(10),
      createdAt: faker.date.recent(),
    })

    expect(session).toBeInstanceOf(Session)
  })
})
