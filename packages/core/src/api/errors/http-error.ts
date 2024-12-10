export interface HttpErrorResult {
  code: string
  message: string
  details?: any
  uuid?: string
}

export interface HttpError extends Error {
  code: string
  details?: any
  uuid?: string
  toResult: () => HttpErrorResult
}
