import { errorMapper } from '@/api/helpers'
import type { Signin } from '@/domain'
import { injectionTokens } from '@/main/di'
import { type Controller, type HttpResponse, mapErrorsByCode, ok } from '@solutions/core/api'
import { controllerErrorHandling, controllerValidationHandling } from '@solutions/core/main'
import { inject, injectable } from 'tsyringe'
import { z } from 'zod'

const { usecases } = injectionTokens

export const signinSchema = z.object({
  username: z.string().email(),
  password: z.string().min(8),
  tenant: z.string().optional(),
  mfaRequired: z.boolean().optional(),
})

export type SigninRequest = z.infer<typeof signinSchema>

@injectable()
@controllerErrorHandling()
@controllerValidationHandling(signinSchema)
export class SigninController implements Controller {
  constructor(@inject(usecases.signin) private readonly signin: Signin) {}

  async handle(request: SigninRequest): Promise<HttpResponse> {
    const { username: email, password, tenant: tenantCode, mfaRequired } = request

    const signinResult = await this.signin.execute({
      email,
      password,
      tenantCode,
      mfaRequired,
    })

    if (signinResult.isLeft()) {
      return mapErrorsByCode(signinResult.value, errorMapper)
    }

    return ok(signinResult.value)
  }
}
