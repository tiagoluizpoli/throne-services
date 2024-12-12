import { injectionLoggerTokens } from '@solutions/logger';
import { injectionAuthTokens } from 'node_modules/@solutions/auth/src/injections';

export const injectionTokens = {
  usecases: {
    getUserTenantsWithAuth: 'GetUserTenantsWithAuth',
    signin: 'Signin',
    respondChallenge: 'RespondChallenge',
    refreshToken: 'RefreshToken',
    getUser: 'GetUser',
    changePassword: 'ChangePassword',
    forgotPassword: 'ForgotPassword',
    confirmForgotPassword: 'ConfirmForgotPassword',
    signout: 'Signout',
  },
  controllers: {
    getUserTenantsWithAuthController: 'GetUserTenantsWithAuthController',
    signinController: 'SigninController',
    respondChallengeController: 'RespondChallengeController',
    authorizeController: 'AuthorizeController',
    refreshTokenController: 'RefreshTokenController',
    getUser: 'GetUserController',
    changePassword: 'ChangePasswordController',
    forgotPassword: 'ForgotPasswordController',
    confirmForgotPassword: 'ConfirmForgotPasswordController',
    signout: 'SignoutController',
  },
  infraestructure: {
    usersRepository: 'UsersRepository',
    sessionRepository: 'SessionRepository',
    sessionChallengeRepository: 'SessionChallengeRepository',
    authentication: 'Authentication',
    ...injectionAuthTokens,
  },
  global: {
    ...injectionLoggerTokens,
  },
};
