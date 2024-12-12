import { faker } from '@faker-js/faker';

import { Session, type Tenant, type User } from '../../src';
import { mockTenant } from './tenant-mock';
import { mockUser } from './user-mock';

type MockSessionParams = {
  sessionParams?: { [key in keyof Session]?: Session[key] };
  tenant?: Tenant;
  user?: User;
};

export const mockSession = ({ sessionParams = {}, tenant, user }: MockSessionParams): Session => {
  const mockedTenant = tenant ?? mockTenant();
  const mockedUser = user ?? mockUser();

  return Session.create({
    tokenIdentifier: faker.string.uuid(),
    refreshTokenIdentifier: faker.string.uuid(),
    tenantCode: mockedTenant.code,
    tenant: mockedTenant,
    userId: mockedUser.id,
    user: mockedUser,
    createdAt: faker.date.recent(),
    ...sessionParams,
  });
};
