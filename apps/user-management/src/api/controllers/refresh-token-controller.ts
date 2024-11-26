import type { RefreshToken } from '@/domain'
import { injectionTokens } from '@/main/di/injection-tokens'
import { type Controller, type HttpResponse, mapErrorsByCode, ok } from '@solutions/core/api'
import { controllerErrorHandling, controllerValidationHandling } from '@solutions/core/main'
import { inject, injectable } from 'tsyringe'
import { z } from 'zod'
import { errorMapper } from '../helpers'

const { usecases } = injectionTokens

export const refreshTokenSchema = z.object({
  refreshToken: z.string(),
})

export type RefreshTokenRequest = z.infer<typeof refreshTokenSchema>

@injectable()
@controllerErrorHandling()
@controllerValidationHandling(refreshTokenSchema)
export class RefreshTokenController implements Controller {
  constructor(@inject(usecases.refreshToken) private readonly refreshToken: RefreshToken) {}

  async handle(request: RefreshTokenRequest): Promise<HttpResponse> {
    const { refreshToken } = request

    const refreshTokenResult = await this.refreshToken.execute({ refreshToken })

    if (refreshTokenResult.isLeft()) {
      return mapErrorsByCode(refreshTokenResult.value, errorMapper)
    }

    return ok(refreshTokenResult.value)
  }
}
