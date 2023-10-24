import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { closeApp, initAppWithAuth } from './utils';

const mockedUserData = {
  password: 'test',
  firstName: 'Test',
  email: 'test@example.com',
};

describe('Auth endpoints', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let token: string;

  beforeEach(async () => {
    ({ prisma, app, token } = await initAppWithAuth());
  });

  afterEach(async () => {
    await closeApp(prisma, app);
  });

  describe('GET /users/', () => {
    it('should successfully get users with pagination', async () => {
      const response = await request(app.getHttpServer())
        .get('/users?page=0&countPerPage=1')
        .set('Authorization', `Bearer ${token}`);
      console.log(response.body);
      expect(response.body.counts).toBeGreaterThanOrEqual(1);
      expect(response.statusCode).toBe(200);
    });

    it('should throw UNAUTHORIZED', async () => {
      const response = await request(app.getHttpServer()).get(
        '/users?page=0&countPerPage=1',
      );

      expect(response.statusCode).toBe(401);
    });
  });
});
