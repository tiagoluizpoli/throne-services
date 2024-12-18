import { env } from '@/main/config';

import { injectionTokens } from './injection-tokens';
import { registerApplicationInjections } from './injections/application-injections';
import { registerControllerInjections } from './injections/controller-injections';
import { registerGlobalInjections } from './injections/global-injections';
import { registerInfrastructureInjections } from './injections/infrastructure-injections';

export const isLocalEnv = env.baseConfig.environment === 'local';
export const isProdEnv = env.baseConfig.environment === 'prod';

const { global } = injectionTokens;

registerGlobalInjections();

registerInfrastructureInjections();

registerApplicationInjections();

registerControllerInjections();
