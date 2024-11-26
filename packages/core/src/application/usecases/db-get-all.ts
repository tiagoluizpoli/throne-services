import { type Either, right } from '../../domain'
import type { GetAll, GetAllErrors, GetAllParams, GetAllResult } from '../../domain/usecases/get-all'
import type { GetAllRepository } from '../contracts'

export class DbGetAll<R> implements GetAll<R> {
  constructor(private readonly getAllRepository: GetAllRepository<R>) {}

  async execute({
    tenantCode,
    search,
    pageIndex,
    pageSize,
    orderBy,
    orderDirection,
  }: GetAllParams): Promise<Either<GetAllErrors, GetAllResult<R>>> {
    const result = await this.getAllRepository.getAll({
      tenantCode,
      search,
      pageIndex,
      pageSize,
      orderBy,
      orderDirection,
    })

    return right(result)
  }
}
