import 'reflect-metadata'
import './di/register-injections'

import { env } from '@/main/config/env'
import { router } from '@/main/routes'
import { startServer } from '@solutions/core/main'

startServer({
  port: env.server.port,
  logLevel: env.common.logLevel,
  router: router,
}).catch(console.error)
