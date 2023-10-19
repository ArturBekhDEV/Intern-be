import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { closeApp, initApp } from './utils';

describe('Auth endpoints', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    ({ prisma, app } = await initApp());
  });

  afterAll(async () => {
    await closeApp(prisma, app);
  });

  describe('POST /auth/sign-up', () => {
    it('should successfully sign up', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send({
          password: 'test',
          firstName: 'Test',
          email: 'test@example.com',
        });

      expect(response.statusCode).toBe(201);
    });

    it('should throw FORBIDDEN if admin user already exists', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send({
          password: 'test',
          firstName: 'Test',
          email: 'test@example.com',
        });

      expect(response.statusCode).toBe(403);
    });
  });
});
