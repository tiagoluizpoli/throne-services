import { CreateIntegrationController } from '@/api'
import type { Controller } from '@solutions/core/api'
import { container } from 'tsyringe'
import { injectionTokens } from './injection-tokens'

const { controller } = injectionTokens

export const registerControllerInjections = () => {
  container.register<Controller>(controller.createIntegration, CreateIntegrationController)

  const instancesRegistered = {
    [controller.createIntegration]: `instance of ${CreateIntegrationController.name}`,
  }

  console.debug('controller injections registered', instancesRegistered)
}
