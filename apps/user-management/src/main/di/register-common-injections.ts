import {
  AuthorizeController,
  ChangePasswordController,
  ConfirmForgotPasswordController,
  ForgotPasswordController,
  GetUserController,
  GetUserTenantsWithAuthController,
  RefreshTokenController,
  RespondChallengeController,
  SigninController,
  SignoutController,
} from '@/api';

import {
  DbGetUser,
  DbGetUserTenantsWithAuth,
  RemoteChangePassword,
  RemoteConfirmForgotPassword,
  RemoteForgotPassword,
  RemoteRefreshToken,
  RemoteRespondChallenge,
  RemoteSignin,
  RemoteSignout,
} from '@/application';
import type {
  ChangePassword,
  ConfirmForgotPassword,
  ForgotPassword,
  GetUser,
  GetUserTenantsWithAuth,
  RefreshToken,
  RespondChallenge,
  Signin,
  Signout,
} from '@/domain';
import { env } from '@/main/config/env';
import type { Controller } from '@solutions/core/api';
import { type LogLevel, Logger, type LoggerProps } from '@solutions/logger';
import { Lifecycle, container } from 'tsyringe';
import { injectionTokens } from './injection-tokens';

export const registerCommonInjections = () => {
  const { usecases, controllers, global } = injectionTokens;
  const { logger } = env;

  // Logger
  container.register<LoggerProps>(global.loggerProps, { useValue: { level: logger.level as LogLevel } });
  container.register<Logger>(global.logger, Logger, { lifecycle: Lifecycle.ResolutionScoped });

  // usecases
  container.register<GetUserTenantsWithAuth>(usecases.getUserTenantsWithAuth, DbGetUserTenantsWithAuth);
  container.register<Signin>(usecases.signin, RemoteSignin);
  container.register<RespondChallenge>(usecases.respondChallenge, RemoteRespondChallenge);
  container.register<RefreshToken>(usecases.refreshToken, RemoteRefreshToken);
  container.register<GetUser>(usecases.getUser, DbGetUser);
  container.register<ChangePassword>(usecases.changePassword, RemoteChangePassword);
  container.register<ForgotPassword>(usecases.forgotPassword, RemoteForgotPassword);
  container.register<ConfirmForgotPassword>(usecases.confirmForgotPassword, RemoteConfirmForgotPassword);
  container.register<Signout>(usecases.signout, RemoteSignout);

  // Controllers
  container.register<Controller>(controllers.getUserTenantsWithAuthController, GetUserTenantsWithAuthController);
  container.register<Controller>(controllers.signinController, SigninController);
  container.register<Controller>(controllers.respondChallengeController, RespondChallengeController);
  container.register<Controller>(controllers.authorizeController, AuthorizeController);
  container.register<Controller>(controllers.refreshTokenController, RefreshTokenController);
  container.register<Controller>(controllers.getUser, GetUserController);
  container.register<Controller>(controllers.changePassword, ChangePasswordController);
  container.register<Controller>(controllers.forgotPassword, ForgotPasswordController);
  container.register<Controller>(controllers.confirmForgotPassword, ConfirmForgotPasswordController);
  container.register<Controller>(controllers.signout, SignoutController);
};
