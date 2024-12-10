import { env } from '@/main/config'

import { registerApplicationInjections } from './application-injections'
import { registerControllerInjections } from './controller-injections'
import { registerGlobalInjections } from './global-injections'
import { registerInfrastructureInjections } from './infrastructure-injections'
import { injectionTokens } from './injection-tokens'

export const isLocalEnv = env.baseConfig.environment === 'local'
export const isProdEnv = env.baseConfig.environment === 'prod'

const { global } = injectionTokens

registerGlobalInjections()

registerInfrastructureInjections()

registerApplicationInjections()

registerControllerInjections()
