import type { ExamplesRepository } from '@/application/contracts'
import {
  type Either,
  type GetAllExamples,
  type GetAllExamplesParams,
  type GetAllExamplesPossibleErrors,
  type GetAllExamplesResult,
  UnexpectedError,
  left,
  right,
} from '@/domain'
import { inject, injectable } from 'tsyringe'

@injectable()
export class DbGetAllExamples implements GetAllExamples {
  constructor(@inject('ExamplesRepository') private readonly examplesRepository: ExamplesRepository) {}

  execute = async ({
    tenantCode,
    search,
    pageIndex,
    pageSize,
    orderBy,
    orderDirection,
  }: GetAllExamplesParams): Promise<Either<GetAllExamplesPossibleErrors, GetAllExamplesResult>> => {
    try {
      const countResult = await this.examplesRepository.count({ tenantCode, search })

      const getAllExamplesResult = await this.examplesRepository.getAll({
        tenantCode,
        search,
        pageIndex,
        pageSize,
        orderBy,
        orderDirection,
      })

      return right({
        total: countResult,
        examples: getAllExamplesResult,
      })
    } catch (error) {
      console.error(error)

      return left(new UnexpectedError())
    }
  }
}
