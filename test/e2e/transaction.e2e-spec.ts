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
  await prismaService.transaction_accounts.deleteMany();
  await prismaService.transaction.deleteMany();
  await prismaService.account.deleteMany();
});

const mockAccount = {
  name: 'John Doe',
  document: '999999221',
  email: 'John Doe',
  telephone: '32133213',
  address: 'Rua Teste 22'
};
describe('[e2e] TransactionController', () => {
  it('(POST) transaction/deposit/ - make Deposit Account', async () => {
    const createAccountResponse = await prismaService.account.create({
      data: mockAccount
    });
    const depositResponse = await request(app.getHttpServer())
      .post('/transaction/deposit')
      .send({
        account_id: createAccountResponse.id,
        value: 20
      });

    expect(depositResponse.status).toBe(200);
    expect(depositResponse.body).toEqual(
      expect.objectContaining({
        account_id: createAccountResponse.id,
        after_balance: 20,
        before_balance: 0,
        role: 'ADD',
        type: 'DEPOSIT',
        value: 20
      })
    );
  });
  it('(POST) transaction/deposit/ - make Deposit invalid Account(NOT FOUND)', async () => {
    const depositResponse = await request(app.getHttpServer())
      .post('/transaction/deposit')
      .send({
        account_id: 1,
        value: 20
      });

    expect(depositResponse.status).toBe(404);
    expect(depositResponse.body).toEqual({
      message: 'Account not found!'
    });
  });
  it('(GET) transaction/balance/:id - make Balance Account', async () => {
    const createAccountResponse = await request(app.getHttpServer())
      .post('/account')
      .send(mockAccount);

    const account_id = createAccountResponse.body.id;

    await request(app.getHttpServer()).post('/transaction/deposit').send({
      account_id,
      value: 20
    });
    const balanceResponse = await request(app.getHttpServer()).get(
      `/transaction/balance/${account_id}`
    );
    expect(balanceResponse.status).toBe(200);
    expect(balanceResponse.body).toEqual({
      balance: 20,
      id: account_id,
      message: 'John Doe you have R$20 in your account',
      name: 'John Doe'
    });
  });
  it('(GET) transaction/balance/:id - make invalid Account(NOT FOUND)', async () => {
    const balanceResponse = await request(app.getHttpServer()).get(
      `/transaction/balance/${1}`
    );
    expect(balanceResponse.status).toBe(404);
    expect(balanceResponse.body).toEqual({
      message: 'Account not found!'
    });
  });
  it('(POST) transaction/withdrawal/ - make Withdrawal Account', async () => {
    const createAccountResponse = await request(app.getHttpServer())
      .post('/account')
      .send(mockAccount);

    const account_id = createAccountResponse.body.id;
    await request(app.getHttpServer()).post('/transaction/deposit').send({
      account_id,
      value: 20
    });

    await prismaService.account.findMany();

    const withdrawalResponse = await request(app.getHttpServer())
      .post('/transaction/withdrawal')
      .send({
        account_id,
        value: 10
      });

    expect(withdrawalResponse.status).toBe(200);
    expect(withdrawalResponse.body).toEqual(
      expect.objectContaining({
        account_id,
        after_balance: 10,
        before_balance: 20,
        role: 'SUBTRACT',
        type: 'WITHDRAWAL',
        value: 10
      })
    );
  });
  it('(POST) transaction/withdrawal/ - make Withdrawal Account without balance(BAD REQUEST)', async () => {
    const createAccountResponse = await request(app.getHttpServer())
      .post('/account')
      .send(mockAccount);

    const account_id = createAccountResponse.body.id;

    const withdrawalResponse = await request(app.getHttpServer())
      .post('/transaction/withdrawal')
      .send({
        account_id,
        value: 20
      });

    expect(withdrawalResponse.status).toBe(400);
    expect(withdrawalResponse.body).toEqual({
      message: 'Your balance is insufficient!'
    });
  });
  it('(POST) transaction/withdrawal/ - make Withdrawal invalid Account(NOT FOUND)', async () => {
    const depositResponse = await request(app.getHttpServer())
      .post('/transaction/deposit')
      .send({
        account_id: 1,
        value: 20
      });

    expect(depositResponse.status).toBe(404);
    expect(depositResponse.body).toEqual({
      message: 'Account not found!'
    });
  });
  it('(POST) transaction/transfer/ - make transfer between valid accounts', async () => {
    const createAccountAResponse = await request(app.getHttpServer())
      .post('/account')
      .send(mockAccount);

    const sender_account_id = createAccountAResponse.body.id;
    await request(app.getHttpServer()).post('/transaction/deposit').send({
      account_id: sender_account_id,
      value: 50
    });

    const createAccountBResponse = await request(app.getHttpServer())
      .post('/account')
      .send({ ...mockAccount, document: '231313' });

    const receiver_account_id = createAccountBResponse.body.id;

    const transferResponse = await request(app.getHttpServer())
      .post('/transaction/transfer')
      .send({
        sender_account_id,
        receiver_account_id,
        value: 10
      });

    expect(transferResponse.status).toBe(200);
    expect(transferResponse.body).toEqual(
      expect.objectContaining({
        account_id: sender_account_id,
        after_balance: 40,
        before_balance: 50,
        receiver_account_id,
        role: 'SUBTRACT',
        type: 'TRANSFER',
        value: 10
      })
    );
  });
  it('(POST) transaction/transfer/ - make transfer between accounts with sender invalid account(NOT FOUND)', async () => {
    const transferResponse = await request(app.getHttpServer())
      .post('/transaction/transfer')
      .send({
        sender_account_id: 1,
        receiver_account_id: 2,
        value: 10
      });

    expect(transferResponse.status).toBe(404);
    expect(transferResponse.body).toEqual({
      message: 'Sender account not found!'
    });
  });
  it('(POST) transaction/transfer/ - make transfer between accounts with receiver invalid account(NOT FOUND)', async () => {
    const createAccountAResponse = await request(app.getHttpServer())
      .post('/account')
      .send(mockAccount);

    const sender_account_id = createAccountAResponse.body.id;
    await request(app.getHttpServer()).post('/transaction/deposit').send({
      account_id: sender_account_id,
      value: 50
    });

    const transferResponse = await request(app.getHttpServer())
      .post('/transaction/transfer')
      .send({
        sender_account_id,
        receiver_account_id: 2,
        value: 10
      });

    expect(transferResponse.status).toBe(404);
    expect(transferResponse.body).toEqual({
      message: 'Receiver account not found!'
    });
  });
  it('(POST) transaction/transfer/ - make transfer between accounts with sender without balance(BAD REQUEST)', async () => {
    const createAccountAResponse = await request(app.getHttpServer())
      .post('/account')
      .send(mockAccount);

    const sender_account_id = createAccountAResponse.body.id;

    const createAccountBResponse = await request(app.getHttpServer())
      .post('/account')
      .send({ ...mockAccount, document: '31231' });

    const receiver_account_id = createAccountBResponse.body.id;

    const transferResponse = await request(app.getHttpServer())
      .post('/transaction/transfer')
      .send({
        sender_account_id,
        receiver_account_id,
        value: 10
      });

    expect(transferResponse.status).toBe(400);
    expect(transferResponse.body).toEqual({
      message: 'Transaction error! Your balance is insufficient!'
    });
  });
  it('(POST) transaction/transfer/ - make transfer between accounts with sender and receiver same account(BAD REQUEST)', async () => {
    const createAccountAResponse = await request(app.getHttpServer())
      .post('/account')
      .send(mockAccount);

    const sender_account_id = createAccountAResponse.body.id;

    const transferResponse = await request(app.getHttpServer())
      .post('/transaction/transfer')
      .send({
        sender_account_id,
        receiver_account_id: sender_account_id,
        value: 10
      });

    expect(transferResponse.status).toBe(400);
    expect(transferResponse.body).toEqual({
      message: 'Invalid Transfer Operation!'
    });
  });
  it('(GET) transaction/statement/:id - get statement account', async () => {
    const createAccountAResponse = await request(app.getHttpServer())
      .post('/account')
      .send(mockAccount);

    const account_id = createAccountAResponse.body.id;

    await request(app.getHttpServer()).post('/transaction/deposit').send({
      account_id,
      value: 50
    });
    const statementResponse = await request(app.getHttpServer()).get(
      `/transaction/statement/${account_id}`
    );

    expect(statementResponse.status).toBe(200);
    expect(statementResponse.body[0]).toEqual(
      expect.objectContaining({
        account_transaction_id: account_id,
        role: 'ADD',
        type: 'DEPOSIT',
        value: 50
      })
    );
  });
});
