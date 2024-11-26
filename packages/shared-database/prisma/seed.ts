import { PrismaClient } from '@prisma/shared-database/client'

const prisma = new PrismaClient()

async function main(): Promise<void> {
  await prisma.tenant.upsert({
    where: { code: 'stoneage' },
    update: {},
    create: {
      code: 'stoneage',
      name: 'Stone Age',
      apikey: 'anykey',
    },
  })

  await prisma.user.upsert({
    where: { email: 'luiz.boldrin@stoneage.com.br' },
    update: {},
    create: {
      email: 'luiz.boldrin@stoneage.com.br',
      name: 'Luiz Boldrin',
      tenantUser: {
        create: {
          tenant: {
            connect: {
              code: 'stoneage',
            },
          },
        },
      },
    },
  })

  await prisma.user.upsert({
    where: { email: 'tiago.poli@stoneage.com.br' },
    update: {},
    create: {
      email: 'tiago.poli@stoneage.com.br',
      name: 'Tiago Luiz Poli',
      tenantUser: {
        create: {
          tenant: {
            connect: {
              code: 'stoneage',
            },
          },
        },
      },
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
