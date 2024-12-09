import type { ChangePassword } from '@/domain'
import { injectionTokens } from '@/main/di'
import { type Controller, type HttpResponse, mapErrorsByCode, ok } from '@solutions/core/api'
import { controllerErrorHandling, controllerValidationHandling } from '@solutions/core/main'
import { inject, injectable } from 'tsyringe'
import { z } from 'zod'
import { errorMapper } from '../helpers'

const { usecases } = injectionTokens

const changePasswordSchema = z.object({
  accessToken: z.string(),
  previousPassword: z.string(),
  newPassword: z.string(),
})

export type ChangePasswordRequest = z.infer<typeof changePasswordSchema>

@injectable()
@controllerErrorHandling()
@controllerValidationHandling(changePasswordSchema)
export class ChangePasswordController implements Controller {
  constructor(@inject(usecases.changePassword) private readonly changePassword: ChangePassword) {}

  async handle(request: ChangePasswordRequest): Promise<HttpResponse> {
    const { accessToken, previousPassword, newPassword } = request

    const changePasswordResult = await this.changePassword.execute({
      accessToken,
      previousPassword,
      newPassword,
    })

    if (changePasswordResult.isLeft()) {
      return mapErrorsByCode(changePasswordResult.value, errorMapper)
    }

    return ok(changePasswordResult.value)
  }
}
