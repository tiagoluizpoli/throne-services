import fs from 'node:fs'
import type { BaseLogTarget, BaseLogTargetProps } from '../types'
export type FileTargetOptionName = 'file'

export interface FileTargetConfigProps {
  fileFolder: string
}

export interface FileLogTarget {
  name: FileTargetOptionName
  config: FileTargetConfigProps
}

export type FileLogTargetCreationParams = Pick<FileLogTarget, 'config'> & BaseLogTargetProps

export interface FileLogTargetExtended extends BaseLogTarget {}

export class FileTarget implements FileLogTargetExtended {
  config: FileTargetConfigProps
  identifier: string
  private readonly fileName: string

  constructor({ config, identifier }: FileLogTargetCreationParams) {
    this.config = config
    this.identifier = identifier
    this.fileName = this.buildFileName()
  }

  private readonly buildFileName = (): string => {
    const startedAt = new Date().toISOString().replace(/T/, ' ').replace('Z', '')
    return `${this.config.fileFolder}/${startedAt}-${this.identifier}.txt`
  }

  private _target: FileTargetOptionName = 'file'

  get target(): FileTargetOptionName {
    return this._target
  }

  public log(message: string) {
    fs.mkdirSync(this.config.fileFolder, { recursive: true })
    fs.appendFileSync(this.fileName, `${message}\n`)
  }

  public static create = (params: FileLogTargetCreationParams): FileTarget => {
    return new FileTarget(params)
  }
}
