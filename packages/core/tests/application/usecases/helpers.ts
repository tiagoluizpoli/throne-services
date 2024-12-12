import { faker } from '@faker-js/faker';
import type {
  GetAllRepository,
  GetAllRepositoryParams,
  GetAllRepositoryResult,
  GetByIdRepository,
  GetByIdRepositoryParams,
} from '../../../src/application';

export class TestEntity {
  constructor(
    public id: string,
    public name: string,
  ) {}
}

export class EntityNotFoundError extends Error {
  constructor() {
    super('Entity not found');
    this.name = 'EntityNotFoundError';
  }
}

export class TestEntitiesRepository implements GetByIdRepository<TestEntity>, GetAllRepository<TestEntity> {
  constructor(public testEntities: TestEntity[] = []) {}

  async getById(params: GetByIdRepositoryParams): Promise<TestEntity | undefined> {
    return this.testEntities.find((entity) => entity.id === params.id);
  }

  getAll(params: GetAllRepositoryParams): GetAllRepositoryResult<TestEntity> {
    return {
      total: this.testEntities.length,
      items: this.testEntities,
    };
  }
}

export const mockTestEntity = (): TestEntity => new TestEntity(faker.string.uuid(), faker.person.firstName());
