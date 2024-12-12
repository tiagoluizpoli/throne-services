import { env } from '@/main/config/env';
import { registerCommonInjections } from '@/main/di/register-common-injections';
import { registerAllInfraInjections } from '@/main/di/register-infraestructure-injections';

registerCommonInjections();
registerAllInfraInjections(env.common.environment);
