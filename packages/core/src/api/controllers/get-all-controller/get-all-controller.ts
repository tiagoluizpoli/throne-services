import { inject } from 'tsyringe'
import type { z } from 'zod'
import type { GetAll } from '../../../domain/usecases'
import type { Controller, HttpResponse } from '../../contracts'
import { mapErrorsByCode, ok } from '../../helpers'
import type { getAllValidationSchema } from './get-all-validation-schema'

type GetAllRequest = z.infer<typeof getAllValidationSchema>

export class GetAllController<T> implements Controller {
  constructor(
    @inject('GetAll') private readonly getAll: GetAll<T>,
    @inject('ErrorMapper') private readonly errorMapper: Record<string, any>,
  ) {}

  async handle(request: GetAllRequest): Promise<HttpResponse> {
    const { tenant: tenantCode, search, pageIndex, pageSize, orderBy, orderDirection } = request

    const getAllResult = await this.getAll.execute({
      tenantCode,
      search,
      pageIndex,
      pageSize,
      orderBy,
      orderDirection,
    })

    if (getAllResult.isLeft()) {
      return mapErrorsByCode(getAllResult.value, this.errorMapper)
    }

    return ok(getAllResult.value)
  }
}
