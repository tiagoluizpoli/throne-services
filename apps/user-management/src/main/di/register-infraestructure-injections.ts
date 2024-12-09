import { env } from '@/main/config/env'
import {
  type Authentication,
  CognitoAuthentication,
  type CognitoAuthenticationConfig,
  MockAuthentication,
} from '@solutions/auth'
import {
  DrizzleSessionChallengeRepository,
  DrizzleSessionRepository,
  DrizzleUsersRepository,
  InMemorySessionChallengeRepository,
  InMemorySessionRepository,
  InMemoryUsersRepository,
  type SessionChallengeRepository,
  type SessionRepository,
  type UsersRepository,
} from '@solutions/shared-database'
import { container } from 'tsyringe'
import { injectionTokens } from './injection-tokens'

const { cognito, aws } = env
const { infraestructure } = injectionTokens

export const registerAuthenticationInjections = (env: string) => {
  if (env === 'prod') {
    container.register<CognitoAuthenticationConfig>(infraestructure.cognitoAuthenticationConfig, {
      useValue: {
        clientId: cognito.clientId,
        userPoolId: cognito.userPoolId,
        region: aws.region,
      },
    })
    container.register<Authentication>(infraestructure.authentication, CognitoAuthentication)
  } else {
    container.register<Authentication>(infraestructure.authentication, MockAuthentication)
  }
}

export const registerRepositoryInjections = (env: string) => {
  if (env === 'prod') {
    container.register<UsersRepository>(infraestructure.usersRepository, DrizzleUsersRepository)
    container.register<SessionRepository>(infraestructure.sessionRepository, DrizzleSessionRepository)
    container.register<SessionChallengeRepository>(
      infraestructure.sessionChallengeRepository,
      DrizzleSessionChallengeRepository,
    )
    console.log('prod infra registred: ', env)
  } else {
    container.register<UsersRepository>(infraestructure.usersRepository, InMemoryUsersRepository)
    container.register<SessionRepository>(infraestructure.sessionRepository, InMemorySessionRepository)
    container.register<SessionChallengeRepository>(
      infraestructure.sessionChallengeRepository,
      InMemorySessionChallengeRepository,
    )
    console.log('not prod infra registred: ', env)
  }
}

export const registerAllInfraInjections = (env: string) => {
  registerAuthenticationInjections(env)
  registerRepositoryInjections(env)
}
