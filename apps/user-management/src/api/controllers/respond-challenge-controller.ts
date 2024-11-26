import { errorMapper } from '@/api/helpers'
import type { RespondChallenge, RespondChallengeParams } from '@/domain'
import { injectionTokens } from '@/main/di'
import { type Controller, type HttpResponse, mapErrorsByCode, ok } from '@solutions/core/api'
import { controllerErrorHandling, controllerValidationHandling } from '@solutions/core/main'
import { inject, injectable } from 'tsyringe'
import { z } from 'zod'

const { usecases } = injectionTokens

export const respondChallengeSchema = z.object({
  challengeName: z.enum(['MFA_SETUP', 'SOFTWARE_TOKEN_MFA']),
  session: z.string(),
  params: z.object({
    code: z.string().min(6).max(6),
  }),
})

export type RespondChallengeRequest = z.infer<typeof respondChallengeSchema>

@injectable()
@controllerErrorHandling()
@controllerValidationHandling(respondChallengeSchema)
export class RespondChallengeController implements Controller {
  constructor(@inject(usecases.respondChallenge) private readonly respondChallenge: RespondChallenge) {}

  async handle(request: RespondChallengeRequest): Promise<HttpResponse> {
    const { challengeName, session, params } = request

    const respondChallengeResult = await this.respondChallenge.execute({
      challengeName,
      session,
      params,
    } as RespondChallengeParams)

    if (respondChallengeResult.isLeft()) {
      return mapErrorsByCode(respondChallengeResult.value, errorMapper)
    }

    return ok(respondChallengeResult.value)
  }
}
