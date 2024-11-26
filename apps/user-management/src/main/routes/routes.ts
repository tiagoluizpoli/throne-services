import { Router } from 'express'

import { injectionTokens } from '@/main/di'
import { getCommonRoutes } from '@solutions/core/main'
import { adaptRoute } from '@solutions/core/main'
import packagejson from './../../../package.json'

const { controllers } = injectionTokens

const router = Router()

router.use('/', getCommonRoutes({ serviceName: 'user-management', serviceVersion: packagejson.version }))

// auth routes
router.post('/api/v1/auth/tenants', adaptRoute(controllers.getUserTenantsWithAuthController))
router.post('/api/v1/auth/signin', adaptRoute(controllers.signinController))
router.post('/api/v1/auth/respond-challenge', adaptRoute(controllers.respondChallengeController))
router.post('/api/v1/auth/authorize', adaptRoute(controllers.authorizeController))
router.post('/api/v1/auth/refresh-token', adaptRoute(controllers.refreshTokenController))
router.get('/api/v1/auth/get-user', adaptRoute(controllers.getUser))
router.post('/api/v1/auth/change-password', adaptRoute(controllers.changePassword))
router.post('/api/v1/auth/forgot-password', adaptRoute(controllers.forgotPassword))
router.post('/api/v1/auth/confirm-forgot-password', adaptRoute(controllers.confirmForgotPassword))
router.post('/api/v1/auth/signout', adaptRoute(controllers.signout))

export { router }
