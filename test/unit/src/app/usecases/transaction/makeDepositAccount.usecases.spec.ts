import { MakeDepositAccountUsecases } from 'src/app/usecases/transaction/makeDepositAccount.usecases';
import { roleTransactionsEnum } from 'src/domain/enum/roleTransactions.enum';
import { typeTransactionsEnum } from 'src/domain/enum/typeTransactions.enum';
import { IException } from 'src/domain/protocols/exceptions/exceptions.interface';
import { ILogger } from 'src/domain/protocols/logger/logger.interface';
import { IAccountRepository } from 'src/domain/protocols/repositories/account.repository.interface';
import { ITransactionRepository } from 'src/domain/protocols/repositories/transaction.repository.interface';
import { ITransactionAccountRepository } from 'src/domain/protocols/repositories/transactionAccount.repository.interface';
import { accountMock } from 'test/unit/mocks/account.mock';
import {
  makeExceptionMock,
  makeLoggerMock
} from 'test/unit/mocks/factory.mock';

interface SutTypes {
  sut: MakeDepositAccountUsecases;
  makeAccountRepository: IAccountRepository;
  makeTransactionRepository: ITransactionRepository;
  makeTransactionAccountRepository: ITransactionAccountRepository;
  makeException: IException;
  makeLogger: ILogger;
}

const makeSut = (): SutTypes => {
  const makeAccountRepository: IAccountRepository = {
    create: jest.fn().mockReturnValue(accountMock),
    findAll: jest.fn(),
    deleteById: jest.fn(),
    findById: jest.fn().mockReturnValue({ id: 1, ...accountMock }),
    update: jest.fn(),
    findByDocument: jest.fn().mockReturnValue(null),
  };

  const makeTransactionRepository: ITransactionRepository = {
    create: jest.fn().mockReturnValue({
      id: 1,
      type: typeTransactionsEnum.DEPOSIT,
      value: 20,
      created_at: new Date(2022, 5, 27),
    }),
    findById: jest.fn(),
  };

  const makeTransactionAccountRepository: ITransactionAccountRepository = {
    create: jest.fn().mockReturnValue(accountMock),
    findAll: jest.fn(),
    findAllByAccountId: jest.fn(),
  };

  const makeException = makeExceptionMock;
  const makeLogger = makeLoggerMock;

  const sut = new MakeDepositAccountUsecases(
    makeAccountRepository,
    makeTransactionRepository,
    makeTransactionAccountRepository,
    makeException,
    makeLogger,
  );
  return {
    sut,
    makeAccountRepository,
    makeTransactionRepository,
    makeTransactionAccountRepository,
    makeException,
    makeLogger,
  };
};
describe('app :: usecases :: transaction :: MakeDepositAccountUsecases', () => {
  it('should call AccountRepository to find account with correct values', async () => {
    const { sut, makeAccountRepository } = makeSut();

    await sut.execute(1, 20);

    expect(makeAccountRepository.findById).toHaveBeenCalledWith(1);
  });
  it('should call TransactionRepository with correct values', async () => {
    const { sut, makeTransactionRepository } = makeSut();

    await sut.execute(1, 20);

    expect(makeTransactionRepository.create).toHaveBeenCalledWith(
      typeTransactionsEnum.DEPOSIT,
      20,
    );
  });
  it('should call TransactionAccountRepository with correct values', async () => {
    const { sut, makeTransactionAccountRepository } = makeSut();

    await sut.execute(1, 20);

    expect(makeTransactionAccountRepository.create).toHaveBeenCalledWith(
      1,
      1,
      roleTransactionsEnum.ADD,
      20,
      20,
      40,
    );
  });
  it('should call AccountRepository to update balance account with correct values', async () => {
    const { sut, makeAccountRepository } = makeSut();

    await sut.execute(1, 20);

    expect(makeAccountRepository.update).toHaveBeenCalledWith(1, {
      balance: 40,
    });
  });
  it('should call Logger with correct values', async () => {
    const { sut, makeLogger } = makeSut();

    await sut.execute(1, 20);

    expect(makeLogger.info).toHaveBeenCalledWith(
      'MakeAccountDepositUsecases.execute',
      'Account id:1 received a deposit of R$20',
    );
  });
  it('should return statement with correct values', async () => {
    const { sut } = makeSut();

    const response = await sut.execute(1, 20);

    expect(response).toEqual({
      account_id: 1,
      value: 20,
      role: roleTransactionsEnum.ADD,
      type: typeTransactionsEnum.DEPOSIT,
      before_balance: 20,
      after_balance: 40,
      transaction_id: 1,
    });
  });

  it('should throw if account not found', async () => {
    const { sut, makeAccountRepository, makeException } = makeSut();
    jest
      .spyOn(makeAccountRepository, 'findById')
      .mockReturnValueOnce(Promise.resolve(null));

    try {
      await sut.execute(1, 20);
    } catch (error) {
      expect(makeException.notFound).toHaveBeenCalledWith({
        message: 'Account not found!',
      });
      expect(error).toBeInstanceOf(Error);
    }
  });
});
