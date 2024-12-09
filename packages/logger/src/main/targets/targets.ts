import type { LogTarget, LogTargetCreationParams, TargetOptions } from '../types'
import { ConsoleTarget } from './console'
import { type FileLogTargetCreationParams, FileTarget } from './file'

export const targetMapper: Record<TargetOptions, (props: LogTargetCreationParams) => LogTarget> = {
  console: (props: LogTargetCreationParams) => ConsoleTarget.create(),
  file: (props: LogTargetCreationParams) => FileTarget.create(props as FileLogTargetCreationParams),
}
