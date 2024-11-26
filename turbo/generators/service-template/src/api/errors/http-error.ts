export interface HttpErrorResult {
  code: string
  message: string
  uuid?: string
}

export interface HttpError extends Error {
  code: string
  uuid?: string
  toResult: () => HttpErrorResult
}
