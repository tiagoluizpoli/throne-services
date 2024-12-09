import { faker } from '@faker-js/faker'
import { Tenant } from '../../../src/domain'

type MockTenantParams = {
  [key in keyof Tenant]?: Tenant[key]
}

export const mockTenant = (props: MockTenantParams = {}) =>
  Tenant.create({
    code: faker.word.sample(),
  })
