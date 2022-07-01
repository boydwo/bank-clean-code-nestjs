import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing/test';
import { PrismaServiceClient } from 'src/infra/database/prisma/prisma.service.client';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

let app: INestApplication;
let testingModule: TestingModule;
let prismaService: PrismaServiceClient;

beforeAll(async () => {
  testingModule = await Test.createTestingModule({
    imports: [AppModule]
  }).compile();

  prismaService = new PrismaServiceClient();

  app = testingModule.createNestApplication();
  app.useGlobalPipes(new ValidationPipe());
  await app.init();
});

afterAll(async () => {
  await prismaService.$disconnect();
  await app.close();
});

beforeEach(async () => {
  await prismaService.transaction_accounts.deleteMany();
  await prismaService.transaction.deleteMany();
  await prismaService.account.deleteMany();
});

afterEach(async () => {
  await prismaService.account.deleteMany();
});

const mockAccount = {
  name: 'John Doe',
  document: '999999221',
  email: 'John Doe',
  telephone: '32133213',
  address: 'Rua Teste 22'
};
describe('[e2e] AccountController', () => {
  it('(POST) account/ - Create Account', async () => {
    const accountResponse = await request(app.getHttpServer())
      .post('/account')
      .send(mockAccount);

    expect(accountResponse.status).toBe(200);
    expect(accountResponse.body).toEqual(
      expect.objectContaining({
        address: 'Rua Teste 22',
        balance: 0,
        document: '999999221',
        email: 'John Doe',
        name: 'John Doe',
        telephone: '32133213'
      })
    );
  });
  it('(POST) account/ - Create Account with Invalid Args(BAD REQUEST)', async () => {
    const accountResponse = await request(app.getHttpServer())
      .post('/account')
      .send({
        name: 'teste'
      });

    expect(accountResponse.status).toBe(400);
    expect(accountResponse.body).toEqual({
      error: 'Bad Request',
      message: [
        'email should not be empty',
        'email must be a string',
        'document should not be empty',
        'document must be a string',
        'telephone must be a string',
        'address should not be empty',
        'address must be a string'
      ],
      statusCode: 400
    });
  });

  it('(GET) account/:id - Get valid Account', async () => {
    const createAccountResponse = await request(app.getHttpServer())
      .post('/account')
      .send(mockAccount);

    const getAccountResponse = await request(app.getHttpServer()).get(
      `/account/${createAccountResponse.body.id}`
    );

    expect(getAccountResponse.status).toBe(200);
    expect(getAccountResponse.body).toEqual(
      expect.objectContaining({
        address: 'Rua Teste 22',
        balance: 0,
        document: '999999221',
        email: 'John Doe',
        name: 'John Doe',
        telephone: '32133213'
      })
    );
  });
  it('(GET) account/:id - Get invalid Account(NOT FOUND)', async () => {
    const getAccountResponse = await request(app.getHttpServer()).get(
      `/account/${1}`
    );

    expect(getAccountResponse.status).toBe(404);
    expect(getAccountResponse.body).toEqual({ message: 'Account not found!' });
  });
  it('(PUT) account/:id - update valid Account', async () => {
    const createAccountResponse = await request(app.getHttpServer())
      .post('/account')
      .send(mockAccount);

    const updateAccountResponse = await request(app.getHttpServer())
      .put(`/account/${createAccountResponse.body.id}`)
      .send({
        name: 'John Updated',
        email: 'John Doe',
        telephone: '32133213',
        address: 'Rua Teste 2222233',
        balance: 0,
        document: '999999221'
      });

    expect(updateAccountResponse.status).toBe(200);
    expect(updateAccountResponse.body).toEqual({
      id: createAccountResponse.body.id,
      name: 'John Updated',
      email: 'John Doe',
      telephone: '32133213',
      address: 'Rua Teste 2222233',
      balance: 0,
      document: '999999221'
    });
  });
  it('(PUT) account/:id - update invalid Account with Args(BAD REQUEST)', async () => {
    const createAccountResponse = await request(app.getHttpServer())
      .post('/account')
      .send(mockAccount);

    const updateAccountResponse = await request(app.getHttpServer())
      .put(`/account/${createAccountResponse.body.id}`)
      .send({
        named: 'teste'
      });

    expect(updateAccountResponse.status).toBe(400);
    expect(updateAccountResponse.body).toEqual({
      error: 'Bad Request',
      message: [
        'name should not be empty',
        'name must be a string',
        'email should not be empty',
        'email must be a string',
        'telephone must be a string',
        'address should not be empty',
        'address must be a string'
      ],
      statusCode: 400
    });
  });
  it('(PUT) account/:id - update invalid Account(NOT FOUND)', async () => {
    const updateAccountResponse = await request(app.getHttpServer())
      .put(`/account/${1}`)
      .send(mockAccount);

    expect(updateAccountResponse.status).toBe(404);
    expect(updateAccountResponse.body).toEqual({
      message: 'Account not found!'
    });
  });
  it('(DELETE) account/:id - Delete valid Account', async () => {
    const createAccountResponse = await request(app.getHttpServer())
      .post('/account')
      .send(mockAccount);

    const deleteAccountResponse = await request(app.getHttpServer())
      .delete(`/account/${createAccountResponse.body.id}`)
      .send(mockAccount);

    expect(deleteAccountResponse.status).toBe(200);
    expect(deleteAccountResponse.body).toEqual({
      message: 'Account deleted'
    });
  });
  it('(DELETE) account/:id - Delete invalid Account(NOT FOUND)', async () => {
    const deleteAccountResponse = await request(app.getHttpServer())
      .put(`/account/${1}`)
      .send(mockAccount);

    expect(deleteAccountResponse.status).toBe(404);
    expect(deleteAccountResponse.body).toEqual({
      message: 'Account not found!'
    });
  });
});
