import { DbCreateIntegration } from '@/application'
import type { CreateIntegration } from '@/domain'
import { container } from 'tsyringe'
import { injectionTokens } from './injection-tokens'

const { application } = injectionTokens

export const registerApplicationInjections = () => {
  container.register<CreateIntegration>(application.createIntegration, DbCreateIntegration)

  const instancesRegistered = {
    [application.createIntegration]: `instance of ${DbCreateIntegration.name}`,
  }

  console.debug('application injections registered', instancesRegistered)
}
