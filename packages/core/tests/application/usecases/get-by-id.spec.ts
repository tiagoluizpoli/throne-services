import { DbGetById } from '../../../src/application/usecases';
import type { GetById } from '../../../src/domain/usecases';
import { EntityNotFoundError, TestEntitiesRepository, TestEntity, mockTestEntity } from './helpers';

type SutParams = {
  initialTestEntities?: TestEntity[];
};

type SutTypes = {
  sut: GetById<TestEntity, EntityNotFoundError>;
  testEntitiesRepository: TestEntitiesRepository;
};

const makeSut = ({ initialTestEntities = [] }: SutParams = {}): SutTypes => {
  const testEntitiesRepository = new TestEntitiesRepository(initialTestEntities);
  const sut = new DbGetById<TestEntity, EntityNotFoundError>(testEntitiesRepository, EntityNotFoundError);

  return {
    sut,
    testEntitiesRepository,
  };
};

describe('GetById', () => {
  it('should call getById with correct params', async () => {
    const initialTestEntities = [mockTestEntity(), mockTestEntity()];
    const { sut, testEntitiesRepository } = makeSut({ initialTestEntities });
    const spy = vi.spyOn(testEntitiesRepository, 'getById');
    const params = { tenantCode: 'tenant_code', id: initialTestEntities[0].id };

    const result = await sut.execute(params);

    expect(result.isRight()).toBe(true);
    expect(spy).toHaveBeenCalledWith(params);
  });

  it('should return an entity if found', async () => {
    const initialTestEntities = [mockTestEntity(), mockTestEntity()];
    const { sut } = makeSut({ initialTestEntities });
    const params = { tenantCode: 'tenant_code', id: initialTestEntities[0].id };

    const result = await sut.execute(params);

    expect(result.isRight()).toBe(true);
    expect(result.value).toBeInstanceOf(TestEntity);
    expect(result.value).toEqual(initialTestEntities[0]);
  });

  it('should return not found error if entity is not found', async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      tenantCode: 'tenant_code',
      id: '1',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotFoundError);
  });

  it('should throw if getById throws', async () => {
    const { sut, testEntitiesRepository } = makeSut();
    const error = new Error('Test');
    vi.spyOn(testEntitiesRepository, 'getById').mockRejectedValueOnce(error);

    const promise = sut.execute({
      tenantCode: 'tenant_code',
      id: '1',
    });

    await expect(promise).rejects.toThrow(error);
  });
});
