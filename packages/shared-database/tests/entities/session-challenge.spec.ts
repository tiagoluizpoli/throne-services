import { faker } from '@faker-js/faker'
import { SessionChallenge } from '../../src/entities'

describe('SessionChallenge', () => {
  it('should create a sessionChallenge', () => {
    const sessionChallenge = SessionChallenge.create({
      sessionIdentifier: faker.string.alphanumeric(10),
      tenantCode: faker.string.alphanumeric(5),
      userId: faker.string.alphanumeric(10),
      createdAt: faker.date.recent(),
    })

    expect(sessionChallenge).toBeInstanceOf(SessionChallenge)
  })
})
