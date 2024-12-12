import { faker } from '@faker-js/faker';
import { Tenant } from '../../../src/domain';

describe('Tenant', () => {
  it('should be able to create a tenant', () => {
    const tenant = Tenant.create({
      code: faker.word.sample(),
    });

    expect(tenant).toBeInstanceOf(Tenant);
  });
});
