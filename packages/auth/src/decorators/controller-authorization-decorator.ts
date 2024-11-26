import { type Controller, unauthorized } from '@solutions/core/api'
import { getHash } from '@solutions/core/domain'
import type { Constructor } from '@solutions/core/main'
import type { SessionRepository } from '@solutions/shared-database'
import { container } from 'tsyringe'

import type { Logger } from '@solutions/logger'
import type { Authentication } from '../authentication'

type ControllerAuthorizationHandlingProps = {
  authenticationToken: string
  sessionRepositoryToken: string
  serviceName?: string
}

export const controllerAuthorizationHandling = ({
  authenticationToken,
  sessionRepositoryToken,
  serviceName,
}: ControllerAuthorizationHandlingProps) => {
  return <T extends Constructor<Controller>>(target: T) => {
    const originalHandle = target.prototype.handle

    target.prototype.handle = async function (request: any) {
      const sessionRepository = container.resolve<SessionRepository>(sessionRepositoryToken)
      const authentication = container.resolve<Authentication>(authenticationToken)
      const logger = container.resolve<Logger>('Logger')

      logger.info('Authorizing request')

      const token = request.authorizationToken

      if (!token) {
        logger.error('No token provided')

        return unauthorized()
      }

      logger.debug(`token provided: ${token.substring(0, 20)}...${token.substring(token.length - 20)}`)

      const requestServiceName = serviceName ?? (request.serviceName as string | undefined)
      if (!requestServiceName) {
        logger.error('No service name provided')

        return unauthorized()
      }

      const verifyTokenResult = await authentication.verify(token)

      if (verifyTokenResult.isLeft()) {
        logger.error('Invalid token provided')

        return unauthorized()
      }

      const tokenContent = verifyTokenResult.value
      logger.debug(`token content: ${JSON.stringify(tokenContent, null, 2)}`)

      const hashedToken = getHash({ content: token })
      logger.debug(`hashed token: ${hashedToken.substring(0, 10)}...${hashedToken.substring(hashedToken.length - 10)}`)

      const session = await sessionRepository.getByTokenIdentifier({
        tokenIdentifier: hashedToken,
      })

      if (!session) {
        logger.error('session not found')

        return unauthorized()
      }
      logger.debug('session found', { sessionId: session.id, tokenIdentifier: session.tokenIdentifier })

      const tenant = session.user?.tenants.find((t) => t.code === session.tenantCode)
      if (!tenant) {
        logger.error('user not associated with the tenant')

        return unauthorized()
      }

      if (tokenContent.email !== session.user?.email) {
        logger.error('user email and session email do not match')

        return unauthorized()
      }

      if (!tokenContent.groups?.includes(requestServiceName) && requestServiceName !== 'auth') {
        logger.error(`user not allowed to perform actions on ${requestServiceName} service`)

        return unauthorized()
      }

      logger.info(
        `Request in the service ${serviceName} authorized for user ${session.user?.email} on tenant ${session.tenantCode}`,
      )

      const response = {
        ...request,
        tenant: session.tenantCode,
        externalUserId: tokenContent.sub,
        user: session.user?.email,
        apiKey: session.tenant?.apiKey,
      }

      console.log({ response, tokenContent })
      const httpResponse = await originalHandle.apply(this, [response])
      return httpResponse
    }

    return target
  }
}
