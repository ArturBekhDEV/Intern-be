import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import {
  authorizeTestUser,
  closeApp,
  initApp,
  initAppWithAuth,
  prismaReset,
} from './utils';

const mockedUserData = {
  firstName: 'Jordan',
  lastName: 'Belfort',
  email: 'jordanbelfort@gmail.com',
  password: 'TestData123!',
  role: 'ADMIN',
};

describe('Users endpoints', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  afterAll(async () => {
    await closeApp(prisma, app);
  });

  describe('GET /users/', () => {
    let token: string;
    beforeEach(async () => {
      ({ prisma, app, token } = await initAppWithAuth());
    });

    afterEach(async () => {
      await closeApp(prisma, app);
    });

    it('should successfully get users with pagination', async () => {
      await prisma.user.create({ data: { ...mockedUserData, role: 'ADMIN' } });
      const response = await request(app.getHttpServer())
        .get('/users?page=0&countPerPage=1')
        .set('Authorization', `Bearer ${token}`);

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

  describe('POST /users/', () => {
    beforeEach(async () => {
      ({ prisma, app } = await initApp());
    });

    afterEach(async () => {
      await closeApp(prisma, app);
    });
    it('should successfully create new user by admin', async () => {
      await prismaReset(prisma);
      const adminToken = await authorizeTestUser(prisma);

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(mockedUserData)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.body).toMatchObject({
        ...mockedUserData,
        password: expect.any(String),
        id: expect.any(String),
      });
      expect(response.statusCode).toBe(201);
    });

    it('should throw FORBIDDEN if not admin do this action', async () => {
      await prismaReset(prisma);
      const userToken = await authorizeTestUser(prisma, 'USER');

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(mockedUserData)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.statusCode).toBe(403);
    });

    it('should throw BAD_REQUEST if not admin do this action', async () => {
      const testUserEmail = 'test@gmail.com';
      await prismaReset(prisma);
      const adminToken = await authorizeTestUser(
        prisma,
        'ADMIN',
        testUserEmail,
      );

      const response = await request(app.getHttpServer())
        .post('/users')
        .send({ ...mockedUserData, email: testUserEmail })
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.statusCode).toBe(400);
    });

    it('should throw UNAUTHORIZED', async () => {
      const response = await request(app.getHttpServer())
        .post('/users/')
        .send(mockedUserData);

      expect(response.statusCode).toBe(401);
    });
  });
});
