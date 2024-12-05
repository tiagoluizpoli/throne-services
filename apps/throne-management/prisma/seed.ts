import { PrismaClient } from '@prisma/.prisma/client'

const prisma = new PrismaClient()

async function main(): Promise<void> {
  await prisma.tenant.upsert({
    where: { code: 'stoneage' },
    update: {},
    create: {
      code: 'stoneage',
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
