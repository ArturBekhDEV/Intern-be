import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { closeApp, initApp } from './utils';
import { OAuth2Client } from 'google-auth-library';
<<<<<<< HEAD
import { CryptoService } from '@/core/crypto/crypto.service';
=======
>>>>>>> 3a7f60e (feature: finish auth with google and added tests)

jest.mock('google-auth-library');

const mockedUserData = {
  password: 'test',
  firstName: 'Test',
  email: 'test@example.com',
};

describe('Auth endpoints', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    ({ prisma, app } = await initApp());
  });

  afterEach(async () => {
    await closeApp(prisma, app);
  });

  describe('POST /auth/sign-up', () => {
    it('should successfully sign up', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(mockedUserData);

      expect(response.statusCode).toBe(201);
    });

    it('should throw FORBIDDEN if admin user already exists', async () => {
      await prisma.user.create({
        data: { ...mockedUserData, role: 'ADMIN', email: 'test1@example.com' },
      });

      const response = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(mockedUserData);

      expect(response.statusCode).toBe(403);
    });
  });

<<<<<<< HEAD
  describe('POST /auth/sign-in', () => {
    it('should successfully sign in', async () => {
      const cryptoService = new CryptoService();
      const salt = cryptoService.genSalt(6);
      const password = 'test';
      const hashedPassword = cryptoService.hash(password, salt);

      await prisma.user.create({
        data: { ...mockedUserData, role: 'ADMIN', password: hashedPassword },
      });

      const response = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send({
          email: mockedUserData.email,
          password: mockedUserData.password,
        });

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('token');
    });

    it('should throw UNAUTHORIZED for incorrect email', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send({
          email: 'incorrect@example.com',
          password: mockedUserData.password,
        });

      expect(response.statusCode).toBe(401);
    });

    it('should throw UNAUTHORIZED for incorrect password', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send({
          email: mockedUserData.email,
          password: 'incorrect-password',
        });

      expect(response.statusCode).toBe(401);
    });
  });

  describe('POST /auth/google', () => {
    const token = 'test';

    beforeEach(() => {
      const googleUser = {
        given_name: 'test',
        family_name: 'test',
        email: 'test@test.com',
        sub: '123456789',
      };

      OAuth2Client.prototype.verifyIdToken = jest
        .fn()
        .mockImplementation(() => {
          return Promise.resolve({
            getPayload: jest.fn().mockImplementation(() => googleUser),
          });
        });
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should successfully sign in with google', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/google')
        .send({
=======
  describe('POST /auth/google', () => {
    const token = 'test';

    beforeEach(() => {
      const googleUser = {
        given_name: 'test',
        family_name: 'test',
        email: 'test@test.com',
        sub: '123456789',
      };

      OAuth2Client.prototype.verifyIdToken = jest
        .fn()
        .mockImplementation(() => {
          return Promise.resolve({
            getPayload: jest.fn().mockImplementation(() => googleUser),
          });
        });
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should successfully sign in with google', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/google')
        .send({
>>>>>>> 3a7f60e (feature: finish auth with google and added tests)
          token,
        });

      expect(response.statusCode).toBe(201);
      expect(response.body).toMatchObject({ token: expect.any(String) });
    });

    it('should throw FORBIDDEN if admin user already exists', async () => {
      await prisma.user.create({
        data: { ...mockedUserData, role: 'ADMIN', email: 'test1@example.com' },
      });

      const response = await request(app.getHttpServer())
        .post('/auth/google')
        .send({
          token,
        });

      expect(response.statusCode).toBe(403);
    });
  });
});
