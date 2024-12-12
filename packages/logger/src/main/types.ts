import type {
  ConsoleLogTarget,
  ConsoleLogTargetCreationParams,
  ConsoleLogTargetExtended,
  ConsoleTargetOptionName,
} from './targets/console';
import type {
  FileLogTarget,
  FileLogTargetCreationParams,
  FileLogTargetExtended,
  FileTargetOptionName,
} from './targets/file';

export type TargetOptions = ConsoleTargetOptionName | FileTargetOptionName;

export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface LoggerProps {
  level: LogLevel;
  targets?: LogTargetProps[];
}

export interface BaseLogTargetProps {
  identifier: string;
}

export interface BaseLogTarget {
  log: (message: string, level: LogLevel) => void;
}

// Expected Props for target creation
export type LogTargetProps = ConsoleLogTarget | FileLogTarget;

// Actual Target Implementations Type
export type LogTarget = ConsoleLogTargetExtended | FileLogTargetExtended;

// Target Creation Params (extending things from logger if needed)
export type LogTargetCreationParams = ConsoleLogTargetCreationParams | FileLogTargetCreationParams;
