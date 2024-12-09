import { InMemorySessionRepository, type SessionRepository, type User } from '@solutions/shared-database'
import { Lifecycle, container } from 'tsyringe'
import { type Authentication, MockAuthentication, type TokenParams } from '../../src'

interface SetupDependenciesParams {
  tokenParams: TokenParams[]
  user: User
  groups: string[]
}

export const setupDependencies = ({ tokenParams }: SetupDependenciesParams) => {
  container.register<TokenParams[]>('TokenParams', {
    useValue: tokenParams,
  })

  container.register<Authentication>('Authentication', MockAuthentication, {
    lifecycle: Lifecycle.Singleton,
  })

  container.register<SessionRepository>('SessionRepository', InMemorySessionRepository, {
    lifecycle: Lifecycle.Singleton,
  })
}

export const resolveDependencies = () => {
  const authentication = container.resolve<Authentication>('Authentication')
  const sessionRepository = container.resolve<InMemorySessionRepository>('SessionRepository')

  return {
    authentication,
    sessionRepository,
  }
}
