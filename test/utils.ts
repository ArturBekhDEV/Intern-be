import { AppModule } from '@/app.module';
import { CryptoService } from '@/core/crypto/crypto.service';
import { PRISMA } from '@/prisma/prisma.decorator';
import { PrismaService } from '@/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { Roles } from '@prisma/client';

const cryptoService = new CryptoService();
const configService = new ConfigService({ envFilePath: '.env' });
const jwtService = new JwtService({
  privateKey: configService.get('JWT_SECRET_KEY'),
});

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

export const initAppWithAuth = async () => {
  const { prisma, app } = await initApp();

  const hashSalt = cryptoService.genSalt(6);
  const hashedPassword = cryptoService.hash('test', hashSalt);
  const user = await prisma.user.create({
    data: {
      email: 'test@gmail.com',
      firstName: 'Test',
      lastName: 'Test',
      password: hashedPassword,
      role: Roles.ADMIN,
    },
  });

  const token = jwtService.sign({ id: user.id, role: user.role });

  return { prisma, app, token };
};
