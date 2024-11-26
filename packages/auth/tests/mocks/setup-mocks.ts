import { mockSession, mockTenant, mockUser } from '@solutions/shared-database/tests'
import { createTokens } from './tokens'

export const setupMocks = () => {
  const tokens = createTokens()
  const tenant = mockTenant()
  const user = mockUser({
    tenants: [tenant, mockTenant()],
  })
  const groups = ['test-service']

  const session = mockSession({ sessionParams: { tokenIdentifier: tokens.correctToken.hashedToken }, tenant, user })

  return {
    tokens,
    tenant,
    user,
    groups,
    session,
  }
}
