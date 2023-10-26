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

export const prismaReset = async (prisma: PrismaService) => {
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

export const authorizeTestUser = async (
  prisma: PrismaService,
  role?: Roles,
  email?: string,
) => {
  const hashSalt = cryptoService.genSalt(6);
  const hashedPassword = cryptoService.hash('test', hashSalt);
  const user = await prisma.user.create({
    data: {
      email: !email ? 'test@gmail.com' : email,
      firstName: 'Test',
      lastName: 'Test',
      password: hashedPassword,
      role: !role ? Roles.ADMIN : role,
    },
  });

  const token = jwtService.sign({ id: user.id, role: user.role });
  return token;
};

export const initAppWithAuth = async (
  role = Roles.ADMIN,
  email = 'test@gmail.com',
) => {
  const { prisma, app } = await initApp();

  const token = await authorizeTestUser(prisma, role, email);

  return { prisma, app, token };
};
