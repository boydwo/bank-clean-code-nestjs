import { MakeWithdrawalAccountUsecases } from 'src/app/usecases/transaction/makeWithdrawalAccount.usecases';
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
import { transactionAccountDepositMock } from 'test/unit/mocks/transaction.mock';

interface SutTypes {
  sut: MakeWithdrawalAccountUsecases;
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
    findByDocument: jest.fn().mockReturnValue(null)
  };

  const makeTransactionRepository: ITransactionRepository = {
    create: jest.fn().mockReturnValue({
      id: 1,
      type: typeTransactionsEnum.DEPOSIT,
      value: 20,
      created_at: new Date(2022, 5, 27)
    }),
    findById: jest.fn()
  };

  const makeTransactionAccountRepository: ITransactionAccountRepository = {
    create: jest.fn().mockReturnValue(accountMock),
    findAll: jest.fn(),
    findAllByAccountIdWithTransactionAndAccounts: jest
      .fn()
      .mockReturnValue(transactionAccountDepositMock)
  };

  const makeException = makeExceptionMock;
  const makeLogger = makeLoggerMock;

  const sut = new MakeWithdrawalAccountUsecases(
    makeAccountRepository,
    makeTransactionRepository,
    makeTransactionAccountRepository,
    makeException,
    makeLogger
  );
  return {
    sut,
    makeAccountRepository,
    makeTransactionRepository,
    makeTransactionAccountRepository,
    makeException,
    makeLogger
  };
};
describe('app :: usecases :: transaction :: MakeWithdrawalAccountUsecases', () => {
  it('should call AccountRepository to find account with correct values', async () => {
    const { sut, makeAccountRepository } = makeSut();

    await sut.execute(1, 20);

    expect(makeAccountRepository.findById).toHaveBeenCalledWith(1);
  });
  it('should call TransactionRepository with correct values', async () => {
    const { sut, makeTransactionRepository } = makeSut();

    await sut.execute(1, 20);

    expect(makeTransactionRepository.create).toHaveBeenCalledWith(
      typeTransactionsEnum.WITHDRAWAL,
      20
    );
  });
  it('should call TransactionAccountRepository with correct values', async () => {
    const { sut, makeTransactionAccountRepository } = makeSut();

    await sut.execute(1, 20);

    expect(makeTransactionAccountRepository.create).toHaveBeenCalledWith(
      1,
      1,
      roleTransactionsEnum.SUBTRACT,
      20,
      20,
      0
    );
  });
  it('should call AccountRepository to update balance account with correct values', async () => {
    const { sut, makeAccountRepository } = makeSut();

    await sut.execute(1, 20);

    expect(makeAccountRepository.update).toHaveBeenCalledWith(1, {
      balance: 0
    });
  });
  it('should call Logger with correct values', async () => {
    const { sut, makeLogger } = makeSut();

    await sut.execute(1, 20);

    expect(makeLogger.info).toHaveBeenCalledWith(
      'MakeWithdrawalAccountUsecases.execute',
      'Account id:1 made a withdrawal of R$20'
    );
  });
  it('should return statement with correct values', async () => {
    const { sut } = makeSut();

    const response = await sut.execute(1, 20);

    expect(response).toEqual({
      account_id: 1,
      value: 20,
      role: roleTransactionsEnum.SUBTRACT,
      type: typeTransactionsEnum.WITHDRAWAL,
      before_balance: 20,
      after_balance: 0,
      transaction_id: 1
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
        message: 'Account not found!'
      });
      expect(error).toBeInstanceOf(Error);
    }
  });
  it('should throw if account not have balance', async () => {
    const { sut, makeAccountRepository, makeException } = makeSut();
    jest
      .spyOn(makeAccountRepository, 'findById')
      .mockReturnValueOnce(
        Promise.resolve({ ...accountMock, balance: 0, id: 1 })
      );

    try {
      await sut.execute(1, 20);
    } catch (error) {
      expect(makeException.badRequest).toHaveBeenCalledWith({
        message: 'Your balance is insufficient!'
      });
      expect(error).toBeInstanceOf(Error);
    }
  });
});
