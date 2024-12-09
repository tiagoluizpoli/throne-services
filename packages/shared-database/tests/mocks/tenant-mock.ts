import { faker } from '@faker-js/faker'
import { Tenant } from '../../src/entities'

export type MockTenantParams = {
  [key in keyof Tenant]?: Tenant[key]
}

export const mockTenant = (props: MockTenantParams = {}) =>
  Tenant.create({
    code: faker.string.alphanumeric(5),
    name: faker.company.name(),
    description: faker.company.catchPhrase(),
    apiKey: faker.string.alphanumeric(10),
    createdAt: faker.date.recent(),
    availableUntil: undefined,
    ...props,
  })
