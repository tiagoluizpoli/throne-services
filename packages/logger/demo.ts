import 'reflect-metadata'

import { Logger } from './src/main'

const logger = new Logger({
  level: 'warn',
  targets: [
    {
      name: 'console',
    },
    {
      name: 'file',
      config: {
        fileFolder: './logs',
      },
    },
  ],
})

logger.info('teste info')
logger.warn('teste warn')
logger.error('teste warn')
