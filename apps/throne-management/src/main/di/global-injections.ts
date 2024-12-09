import { Logger, type LoggerProps } from '@solutions/logger'
import { container } from 'tsyringe'
import { injectionTokens } from './injection-tokens'

const { global } = injectionTokens
export const registerGlobalInjections = () => {
  const loggerProps: LoggerProps = {
    level: 'info',
    targets: [
      {
        name: 'console',
      },
    ],
  }

  container.register<LoggerProps>(global.loggerConfig, {
    useValue: loggerProps,
  })

  container.register<Logger>(global.logger, Logger)

  const instancesRegistered = {
    [global.loggerConfig]: loggerProps,
    [global.logger]: `instance of ${Logger.name}`,
  }

  console.debug('global injections registered', instancesRegistered)
}
