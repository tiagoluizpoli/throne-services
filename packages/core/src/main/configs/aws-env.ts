export const awsEnv = () =>
  ({
    aws: {
      region: process.env.AWS_REGION ?? 'us-east-1',
      accessKey: process.env.AWS_ACCESS_KEY_ID ?? '',
      secretKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
      sessionToken: process.env.AWS_SESSION_TOKEN ?? '',
    },
  }) as const;
