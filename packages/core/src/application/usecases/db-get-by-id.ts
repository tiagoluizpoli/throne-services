import { type Either, left, right } from '../../domain';
import type { GetById, GetByIdParams, GetByIdResult } from '../../domain/usecases';
import type { GetByIdRepository } from '../contracts';

export class DbGetById<R, E extends Error> implements GetById<R, E> {
  constructor(
    private readonly getByIdRepository: GetByIdRepository<R>,
    private readonly NotFoundErrorType: new () => E,
  ) {}

  async execute({ tenantCode, id }: GetByIdParams): Promise<Either<E, GetByIdResult<R>>> {
    const result = await this.getByIdRepository.getById({ tenantCode, id });

    if (!result) {
      return left(new this.NotFoundErrorType());
    }

    return right(result);
  }
}
