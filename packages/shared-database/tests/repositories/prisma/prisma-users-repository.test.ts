import 'reflect-metadata'
import { faker } from '@faker-js/faker'
import { type Tenant, User } from '../../../src/entities'
import { PrismaUsersRepository } from '../../../src/repositories'
import { mockTenant, mockUser } from '../../mocks'
import { deleteUsersAndTenants, insertUserAndTenants } from './prisma-setups'

const tenantSort = (a: Tenant, b: Tenant) => a.code.localeCompare(b.code)

type SutTypes = {
  sut: PrismaUsersRepository
}

const tenants = [mockTenant(), mockTenant()]
const user = mockUser({ tenants })

const makeSut = (): SutTypes => {
  const sut = new PrismaUsersRepository()
  return { sut }
}

describe('prisma-users-repository', () => {
  beforeAll(async () => {
    await insertUserAndTenants({ user, tenants })
  })

  afterAll(async () => {
    await deleteUsersAndTenants({ user, tenants })
  })

  describe('getByField', () => {
    it('should return a user by field', async () => {
      const { sut } = makeSut()

      const result = await sut.getByField({ field: 'email', value: user.email, tenantCode: user.tenants[0].code })

      expect(result).toBeInstanceOf(User)
      expect(result?.name).toBe(user.name)
      expect(result?.email).toBe(user.email)
      expect(result?.createdAt).toEqual(user.createdAt)
      expect(result?.tenants.length).toBe(user.tenants.length)
      expect(result?.tenants.sort(tenantSort)).toEqual(user.tenants.sort(tenantSort))
    })

    it('should return undefined when email not found', async () => {
      const { sut } = makeSut()

      const result = await sut.getByField({ field: 'email', value: 'inexistent', tenantCode: user.tenants[0].code })

      expect(result).toBeUndefined()
    })

    it('should return undefined when user from another tenant not found', async () => {
      const { sut } = makeSut()

      const result = await sut.getByField({ field: 'email', value: user.email, tenantCode: 'any-tenant' })

      expect(result).toBeUndefined()
    })

    it('should throw when prisma throws', async () => {
      const { sut } = makeSut()

      const promise = sut.getByField({ field: 'invalid-field', value: user.email, tenantCode: user.tenants[0].code })

      await expect(promise).rejects.toThrow()
    })
  })

  describe('getByEmail', () => {
    it('should return a user by email', async () => {
      const { sut } = makeSut()

      const result = await sut.getByEmail(user.email)

      expect(result).toBeInstanceOf(User)
      expect(result?.name).toBe(user.name)
      expect(result?.email).toBe(user.email)
      expect(result?.createdAt).toEqual(user.createdAt)
      expect(result?.tenants.length).toBe(user.tenants.length)
      expect(result?.tenants.sort(tenantSort)).toEqual(user.tenants.sort(tenantSort))
    })

    it('should return undefined when email not found', async () => {
      const { sut } = makeSut()

      const result = await sut.getByEmail(faker.internet.email())

      expect(result).toBeUndefined()
    })

    it('should throw when prisma throws', async () => {
      const { sut } = makeSut()

      // @ts-expect-error: testing error case
      const promise = sut.getByEmail(1)

      await expect(promise).rejects.toThrow()
    })
  })
})
