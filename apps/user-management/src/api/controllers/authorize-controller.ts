import { injectionTokens } from '@/main/di'
import { controllerAuthorizationHandling } from '@solutions/auth'
import { type Controller, type HttpResponse, ok, unauthorized } from '@solutions/core/api'
import { controllerErrorHandling, controllerValidationHandling } from '@solutions/core/main'
import type { Logger } from '@solutions/logger'
import { inject, injectable } from 'tsyringe'
import { z } from 'zod'

const { infraestructure } = injectionTokens

export const authorizeSchema = z.object({
  serviceName: z.string(),
  tenant: z.string(),
  user: z.string(),
  externalUserId: z.string(),
  apiKey: z.string(),
})

export type AuthorizeRequest = z.infer<typeof authorizeSchema>

@injectable()
@controllerErrorHandling()
@controllerAuthorizationHandling({
  authenticationToken: infraestructure.authentication,
  sessionRepositoryToken: infraestructure.sessionRepository,
})
@controllerValidationHandling(authorizeSchema)
export class AuthorizeController implements Controller {
  constructor(@inject('Logger') private readonly logger: Logger) {}

  async handle({ tenant, user, apiKey, externalUserId }: AuthorizeRequest): Promise<HttpResponse> {
    console.log('AuthorizeController', { tenant, user, apiKey, externalUserId })
    if (!tenant || !user || !apiKey) {
      this.logger.debug('tenant, user or apiKey not present', { tenant, user, apiKey })
      return unauthorized()
    }

    return ok({ tenant, user, apiKey, externalUserId })
  }
}
