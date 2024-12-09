export type CreateIntegrationParams = {
  name: string
  code: string
  description: string
  sourceMethod: string
  targetMethod: string
  targetUrl: string
}

export interface CreateIntegration {
  execute: (params: CreateIntegrationParams) => Promise<void>
}
