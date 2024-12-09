export const cognitoEnv = () =>
  ({
    cognito: {
      userPoolId: process.env.COGNITO_USER_POOL_ID ?? '',
      clientId: process.env.COGNITO_CLIENT_ID ?? '',
    },
  }) as const
