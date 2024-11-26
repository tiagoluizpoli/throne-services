import { env } from '@/main/config'

const isLocalEnv = env.baseConfig.environment === 'local'
const isProdEnv = env.baseConfig.environment === 'prod'
