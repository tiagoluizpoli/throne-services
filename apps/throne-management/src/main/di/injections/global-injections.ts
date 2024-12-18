import { type LogTargetProps, Logger, type LoggerProps } from '@solutions/logger';
import { Lifecycle } from 'tsyringe';
import { registerInjection } from '../helpers';
import { injectionTokens } from '../injection-tokens';

const { global } = injectionTokens;
export const registerGlobalInjections = () => {
  const loggerProps: LoggerProps = {
    level: 'info',
    targets: [
      {
        name: 'console',
      },
    ] as LogTargetProps[],
  };

  registerInjection(global.loggerConfig, {
    useValue: loggerProps,
  });
  registerInjection(global.logger, Logger, {
    lifecycle: Lifecycle.ResolutionScoped,
  });
};
