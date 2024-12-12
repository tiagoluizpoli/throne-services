import { faker } from '@faker-js/faker';
import { User } from '../../src/entities';
import { mockTenant } from './tenant-mock';

export type MockUserParams = {
  [key in keyof User]?: User[key];
};

export const mockUser = (props: MockUserParams = {}) =>
  User.create({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    createdAt: faker.date.recent(),
    tenants: [mockTenant(), mockTenant()],
    ...props,
  });
