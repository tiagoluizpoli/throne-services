import type { BaseLogTarget, BaseLogTargetProps, LogLevel } from '../types';

export type ConsoleTargetOptionName = 'console';

export interface ConsoleLogTarget {
  name: ConsoleTargetOptionName;
}

const consolePrintByLogLevel: Record<LogLevel, (log: string) => void> = {
  trace: (msg) => console.trace(msg),
  debug: (msg) => console.debug(msg),
  info: (msg) => console.info(msg),
  warn: (msg) => console.warn(msg),
  error: (msg) => console.error(msg),
  fatal: (msg) => console.error(msg),
};

export interface ConsoleLogTargetExtended extends BaseLogTarget {}

export type ConsoleLogTargetCreationParams = BaseLogTargetProps;

export class ConsoleTarget implements ConsoleLogTargetExtended {
  private _target: ConsoleTargetOptionName = 'console';

  get target(): ConsoleTargetOptionName {
    return this._target;
  }

  log = (message: string, level: LogLevel): void => {
    consolePrintByLogLevel[level](message);
  };
  static create = (): ConsoleTarget => {
    return new ConsoleTarget();
  };
}
