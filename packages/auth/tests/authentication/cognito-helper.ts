import {
  AdminCreateUserCommand,
  AdminDeleteUserCommand,
  AdminGetUserCommand,
  AdminResetUserPasswordCommand,
  AdminSetUserMFAPreferenceCommand,
  AdminSetUserPasswordCommand,
  CognitoIdentityProviderClient,
  type UserNotFoundException,
} from '@aws-sdk/client-cognito-identity-provider';
import { faker } from '@faker-js/faker';

const UserPoolId = process.env.COGNITO_USER_POOL_ID ?? '';

export type Credentials = {
  email: string;
  password: string;
};

export const cognitoClient = new CognitoIdentityProviderClient({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
    sessionToken: process.env.AWS_SESSION_TOKEN,
  },
  region: process.env.AWS_REGION ?? 'us-east-1',
});

export const validCredentials: Credentials = {
  email: 'luiz.boldrin+teste@stoneage.com.br',
  password: faker.internet.password({ length: 10, prefix: 'aA@0', pattern: /[a-zA-Z0-9]/ }),
};

export const createUser = async ({ email, password }: Credentials) => {
  await cognitoClient.send(
    new AdminCreateUserCommand({
      UserPoolId,
      Username: email,
      TemporaryPassword: password,
      MessageAction: 'SUPPRESS',
      UserAttributes: [
        {
          Name: 'email',
          Value: email,
        },
        {
          Name: 'email_verified',
          Value: 'true',
        },
      ],
    }),
  );
};

export const getUser = async ({ email }: Pick<Credentials, 'email'>) => {
  try {
    const user = await cognitoClient.send(
      new AdminGetUserCommand({
        UserPoolId,
        Username: email,
      }),
    );

    return user;
  } catch (error) {
    if ((error as UserNotFoundException).name === 'UserNotFoundException') {
      return;
    }
    throw new Error('Não foi possível se conectar ao Cognito');
  }
};

export const deleteUser = async ({ email }: Pick<Credentials, 'email'>) => {
  await cognitoClient.send(
    new AdminDeleteUserCommand({
      UserPoolId,
      Username: email,
    }),
  );
};

export const setPassword = async ({ email, password }: Credentials) => {
  await cognitoClient.send(
    new AdminSetUserPasswordCommand({
      UserPoolId,
      Username: email,
      Password: password,
      Permanent: true,
    }),
  );
};

export const resetPassword = async ({ email }: Pick<Credentials, 'email'>) => {
  await cognitoClient.send(
    new AdminResetUserPasswordCommand({
      UserPoolId,
      Username: email,
    }),
  );
};

export const updateUserMFA = async ({ email, flag }: Pick<Credentials, 'email'> & { flag: boolean }) => {
  try {
    await cognitoClient.send(
      new AdminSetUserMFAPreferenceCommand({
        UserPoolId,
        Username: email,
        SoftwareTokenMfaSettings: {
          Enabled: flag,
          PreferredMfa: flag,
        },
      }),
    );
  } catch (error) {
    throw new Error('Não foi possível se conectar ao Cognito');
  }
};

export const prepareUserToTest = async ({ email, password }: Credentials) => {
  const user = await getUser({ email });

  if (!user) {
    await createUser({ email, password });
    await setPassword({ email, password });
  }
};
