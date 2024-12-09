import { nanoid } from 'nanoid'

import { inject, injectable } from 'tsyringe'
import { injectionLoggerTokens } from '../main/injection-tokens'
import { targetMapper } from './targets'
import type { LogLevel, LogTarget, LogTargetProps, LoggerProps } from './types'

const logLevelRankMapper: Record<LogLevel, number> = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
}

@injectable()
export class Logger {
  private readonly identifier: string
  private tags: Record<string, string> = {}

  private readonly definedLogLevelRank: number

  constructor(@inject(injectionLoggerTokens.loggerProps) { level, targets }: LoggerProps) {
    this.identifier = nanoid()

    this.definedLogLevelRank = logLevelRankMapper[level]

    this.targets = this.populateTargets(targets ?? [{ name: 'console' }])
  }

  private readonly allowLog = (logLevel: LogLevel): boolean => {
    const requestedLogLevelRank = logLevelRankMapper[logLevel]

    return requestedLogLevelRank <= this.definedLogLevelRank
  }

  private readonly populateTargets = (targets: LogTargetProps[]): LogTarget[] => {
    const createdTargets = targets.map((target) => {
      return targetMapper[target.name]({
        ...target,
        identifier: this.identifier,
      })
    })

    return createdTargets
  }

  private readonly targets: LogTarget[]

  public trace = (log: string, tags: Record<string, string> = {}): void => {
    this.writeLogs('trace', log, tags)
  }

  public debug = (log: string, tags: Record<string, string> = {}): void => {
    this.writeLogs('debug', log, tags)
  }

  public info = (log: string, tags: Record<string, string> = {}): void => {
    this.writeLogs('info', log, tags)
  }

  public warn = (log: string, tags: Record<string, string> = {}): void => {
    this.writeLogs('warn', log, tags)
  }

  public error = (log: string, tags: Record<string, string> = {}): void => {
    this.writeLogs('error', log, tags)
  }

  public fatal = (log: string, tags: Record<string, string> = {}): void => {
    this.writeLogs('fatal', log, tags)
  }

  public addTag = (key: string, value: string): void => {
    this.tags[key] = value
  }

  public removeTag = (key: string): void => {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete this.tags[key]
  }

  public clearTags = (): void => {
    this.tags = {}
  }

  private readonly formmatMessage = (logLevel: LogLevel, log: string, tags: Record<string, string>): string => {
    const formattedDate = new Date().toISOString().replace(/T/, ' ').replace('Z', '')

    const allTags = { ...this.tags, ...tags }

    const tagsString = Object.keys(allTags)
      .map((key) => `${key}=${allTags[key]}`)
      .join(', ')

    const fommatedTags = Object.keys(allTags).length > 0 ? ` :: ${tagsString}` : ''

    return `${formattedDate} :: ${logLevel} :: ${this.identifier} :: ${log}${fommatedTags}`
  }

  private readonly writeLogs = (logLevel: LogLevel, log: string, tags: Record<string, string> = {}): void => {
    try {
      if (this.allowLog(logLevel)) {
        for (const target of this.targets) {
          const formattedLog = this.formmatMessage(logLevel, log, tags)
          target.log(formattedLog, logLevel)
        }
      }
    } catch (error) {
      console.info({ log })
      console.error({ message: 'An error occurred when trying to write the log', error })
    }
  }
}
