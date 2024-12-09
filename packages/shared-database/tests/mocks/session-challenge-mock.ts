import { faker } from '@faker-js/faker'
import { SessionChallenge, type Tenant, type User } from '../../src/entities'
import { mockTenant } from './tenant-mock'
import { mockUser } from './user-mock'

type MockSessionChallengeParams = {
  sessionChallengeParams?: { [key in keyof SessionChallenge]?: SessionChallenge[key] }
  tenant?: Tenant
  user?: User
}

export const mockSessionChallenge = ({
  sessionChallengeParams = {},
  tenant,
  user,
}: MockSessionChallengeParams): SessionChallenge => {
  const mockedTenant = tenant ?? mockTenant()
  const mockedUser = user ?? mockUser()

  return SessionChallenge.create({
    sessionIdentifier: faker.string.uuid(),
    tenantCode: mockedTenant.code,
    tenant: mockedTenant,
    userId: mockedUser.id,
    user: mockedUser,
    createdAt: faker.date.recent(),
    ...sessionChallengeParams,
  })
}
