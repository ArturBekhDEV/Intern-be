import { AppModule } from '@/app.module';
import { PRISMA } from '@/prisma/prisma.decorator';
import { PrismaService } from '@/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

const prismaReset = async (prisma: PrismaService) => {
  await prisma.truncate();
  await prisma.resetSequences();
};

export const initApp = async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  const prisma = moduleRef.get<PrismaService>(PRISMA);

  const app = moduleRef.createNestApplication();
  await app.init();
  await prismaReset(prisma);
  return { prisma, app };
};

export const closeApp = async (
  prisma: PrismaService,
  app: INestApplication,
) => {
  await prismaReset(prisma);
  await prisma.$disconnect();
  await app.close();
};
