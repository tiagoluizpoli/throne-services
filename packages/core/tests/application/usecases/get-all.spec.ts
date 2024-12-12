import { DbGetAll } from '../../../src/application/usecases';
import type { GetAll, GetAllParams } from '../../../src/domain/usecases';
import { TestEntitiesRepository, type TestEntity, mockTestEntity } from './helpers';

type SutParams = {
  initialTestEntities?: TestEntity[];
};

type SutTypes = {
  sut: GetAll<TestEntity>;
  testEntitiesRepository: TestEntitiesRepository;
};

const makeSut = ({ initialTestEntities = [] }: SutParams = {}): SutTypes => {
  const testEntitiesRepository = new TestEntitiesRepository(initialTestEntities);
  const sut = new DbGetAll<TestEntity>(testEntitiesRepository);

  return {
    sut,
    testEntitiesRepository,
  };
};

describe('GetAll', () => {
  it('should call getAll with correct params', async () => {
    const initialTestEntities = [mockTestEntity(), mockTestEntity()];
    const { sut, testEntitiesRepository } = makeSut({ initialTestEntities });
    const spy = vi.spyOn(testEntitiesRepository, 'getAll');
    const params: GetAllParams = {
      tenantCode: 'tenant_code',
      pageIndex: 0,
      pageSize: 10,
      orderBy: 'createdAt',
      orderDirection: 'desc',
      search: 'search',
    };

    const result = await sut.execute(params);

    expect(result.isRight()).toBe(true);
    expect(spy).toHaveBeenCalledWith(params);
  });

  it('should return the result of getAll', async () => {
    const initialTestEntities = [mockTestEntity(), mockTestEntity()];
    const { sut, testEntitiesRepository } = makeSut({ initialTestEntities });
    const spy = vi.spyOn(testEntitiesRepository, 'getAll');

    const result = await sut.execute({
      tenantCode: 'tenant_code',
      pageIndex: 0,
      pageSize: 10,
      orderBy: 'createdAt',
      orderDirection: 'desc',
      search: 'search',
    });

    expect(result.isRight()).toBe(true);
    expect(spy).toHaveReturnedWith(result.value);
  });

  it('should rethrow if getAll throws', async () => {
    const { sut, testEntitiesRepository } = makeSut();
    const error = new Error('test_error');
    vi.spyOn(testEntitiesRepository, 'getAll').mockImplementationOnce(() => {
      throw error;
    });

    const promise = sut.execute({
      tenantCode: 'tenant_code',
      pageIndex: 0,
      pageSize: 10,
      orderBy: 'createdAt',
      orderDirection: 'desc',
      search: 'search',
    });

    await expect(promise).rejects.toThrow(error);
  });
});
