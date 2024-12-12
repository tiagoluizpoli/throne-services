import { PrismaClient } from '@prisma/.prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  await prisma.tenant.upsert({
    where: { code: 'stoneage' },
    update: {},
    create: {
      code: 'stoneage',
      name: 'Stone Age',
    },
  });

  await prisma.example.upsert({
    where: { code: 'example-1' },
    update: {},
    create: {
      code: 'example-1',
      name: 'Example 1',
      description: 'Description of example 1',
      tenant: {
        connect: {
          code: 'stoneage',
        },
      },
    },
  });

  await prisma.example.upsert({
    where: { code: 'example-2' },
    update: {},
    create: {
      code: 'example-2',
      name: 'Example 2',
      description: 'Description of example 2',
      tenant: {
        connect: {
          code: 'stoneage',
        },
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
