import type { Prisma } from '@prisma/.prisma/client'

import type {
  ExamplesRepository,
  ExamplesRepositoryCountParams,
  ExamplesRepositoryGetAllParams,
  ExamplesRepositoryGetAllResult,
  ExamplesRepositoryGetByIdParams,
} from '@/application/contracts'
import type { Example } from '@/domain'
import { ExampleMapper } from '@/infrastructure/mappers'
import { prisma } from '@/main/prisma/client'
import { injectable } from 'tsyringe'

@injectable()
export class PrismaExamplesRepository implements ExamplesRepository {
  async getAll({
    tenantCode,
    search,
    pageIndex,
    pageSize,
    orderBy,
    orderDirection,
  }: ExamplesRepositoryGetAllParams): Promise<ExamplesRepositoryGetAllResult> {
    const where = await this.buildSearchWhereClause({ search })

    const examplesPersistence = await prisma.example.findMany({
      where: {
        tenant: {
          code: tenantCode,
        },
        ...where,
      },
      skip: pageIndex * pageSize,
      take: pageSize,
      orderBy: {
        [orderBy]: orderDirection,
      },
      include: {
        tenant: true,
      },
    })

    return examplesPersistence.map((example) => ExampleMapper.toDomain(example))
  }

  async count({ tenantCode, search }: ExamplesRepositoryCountParams): Promise<number> {
    const where = await this.buildSearchWhereClause({ search })

    const count = await prisma.example.count({
      where: {
        tenant: {
          code: tenantCode,
        },
        ...where,
      },
    })

    return count
  }

  async getById({ exampleId, tenantCode }: ExamplesRepositoryGetByIdParams): Promise<Example | undefined> {
    const examplePersistence = await prisma.example.findFirst({
      where: {
        id: exampleId,
        tenant: {
          code: tenantCode,
        },
      },
      include: {
        tenant: true,
      },
    })

    if (!examplePersistence) {
      return undefined
    }

    return ExampleMapper.toDomain(examplePersistence)
  }

  async save(example: Example): Promise<void> {
    await prisma.example.create({
      data: {
        id: example.id,
        tenant: {
          connect: {
            code: example.tenantCode,
          },
        },
        code: example.code,
        name: example.name,
        description: example.description,
        createdAt: example.createdAt,
      },
    })
  }

  private async buildSearchWhereClause({
    search,
  }: Pick<ExamplesRepositoryGetAllParams, 'search'>): Promise<Prisma.exampleWhereInput> {
    return search
      ? {
          OR: [search.length === 36 ? { id: { equals: search } } : {}],
        }
      : {}
  }
}
