import { faker } from '@faker-js/faker'
import { User } from '../../src/entities'

describe('User', () => {
  it('should create a user', () => {
    const user = User.create({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      createdAt: faker.date.recent(),
      tenants: [],
    })

    expect(user).toBeInstanceOf(User)
  })
})
