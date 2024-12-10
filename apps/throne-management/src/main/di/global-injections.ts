import { type LogTargetProps, Logger, type LoggerProps } from '@solutions/logger'
import { Lifecycle, container } from 'tsyringe'
import { injectionTokens } from './injection-tokens'

const { global } = injectionTokens
export const registerGlobalInjections = () => {
  const loggerProps: LoggerProps = {
    level: 'info',
    targets: [
      {
        name: 'console',
      },
    ] as LogTargetProps[],
  }

  container.register<LoggerProps>(global.loggerConfig, {
    useValue: loggerProps,
  })

  container.register<Logger>(global.logger, Logger, {
    lifecycle: Lifecycle.ResolutionScoped,
  })

  const instancesRegistered = {
    [global.loggerConfig]: JSON.stringify(loggerProps),
    [global.logger]: `instance of ${Logger.name}`,
  }

  console.debug('global injections registered', instancesRegistered)
}
