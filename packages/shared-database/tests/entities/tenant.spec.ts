import { faker } from '@faker-js/faker'
import { Tenant } from '../../src/entities'

describe('Tenant', () => {
  it('should create a tenant', () => {
    const tenant = Tenant.create({
      code: faker.string.alphanumeric(5),
      name: faker.company.name(),
      description: faker.company.catchPhrase(),
      apiKey: faker.string.alphanumeric(10),
      createdAt: faker.date.recent(),
    })

    expect(tenant).toBeInstanceOf(Tenant)
  })
})
