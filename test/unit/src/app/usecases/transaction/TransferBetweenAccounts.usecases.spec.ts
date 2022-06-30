import { TransferBetweenAccountsUsecases } from 'src/app/usecases/transaction/transferBetweenAccounts.usecases';
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
  sut: TransferBetweenAccountsUsecases;
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
    findById: jest.fn().mockImplementation((id) => {
      if (id == 1) return { ...accountMock, id: 1 };
      return { ...accountMock, id: 2 };
    }),
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

  const sut = new TransferBetweenAccountsUsecases(
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
describe('app :: usecases :: transaction :: MakeDepositAccountUsecases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call AccountRepository 2 times with different ids', async () => {
    const { sut, makeAccountRepository } = makeSut();

    await sut.execute(1, 2, 20);

    expect(makeAccountRepository.findById).toHaveBeenCalledTimes(2);
    expect(makeAccountRepository.findById).toHaveBeenCalledWith(1);
    expect(makeAccountRepository.findById).toHaveBeenCalledWith(2);
  });
  it('should call TransactionRepository with correct values', async () => {
    const { sut, makeTransactionRepository } = makeSut();

    await sut.execute(1, 2, 20);

    expect(makeTransactionRepository.create).toHaveBeenCalledWith(
      typeTransactionsEnum.TRANSFER,
      20
    );
  });
  it('should call TransactionAccountRepository 2 times with correct values', async () => {
    const { sut, makeTransactionAccountRepository } = makeSut();

    await sut.execute(1, 2, 20);

    expect(makeTransactionAccountRepository.create).toHaveBeenCalledTimes(2);
    expect(makeTransactionAccountRepository.create).toHaveBeenCalledWith(
      1,
      1,
      roleTransactionsEnum.SUBTRACT,
      20,
      20,
      0
    );
    expect(makeTransactionAccountRepository.create).toHaveBeenCalledWith(
      2,
      1,
      roleTransactionsEnum.ADD,
      20,
      20,
      40
    );
  });
  it('should call AccountRepository to update balance account 2 times with correct values', async () => {
    const { sut, makeAccountRepository } = makeSut();

    await sut.execute(1, 2, 20);

    expect(makeAccountRepository.update).toHaveBeenCalledTimes(2);
    expect(makeAccountRepository.update).toHaveBeenCalledWith(1, {
      balance: 0
    });
    expect(makeAccountRepository.update).toHaveBeenCalledWith(2, {
      balance: 40
    });
  });
  it('should call Logger with correct values', async () => {
    const { sut, makeLogger } = makeSut();

    await sut.execute(1, 2, 20);
    expect(makeLogger.info).toHaveBeenCalledTimes(1);
    expect(makeLogger.info).toHaveBeenCalledWith(
      'TransferBetweenAccountsUsecases.execute',
      'Account id:1 transferred R$20 to Account id:2'
    );
  });
  it('should return statement with correct values', async () => {
    const { sut } = makeSut();

    const response = await sut.execute(1, 20, 20);

    expect(response).toEqual({
      account_id: 1,
      value: 20,
      role: roleTransactionsEnum.SUBTRACT,
      type: typeTransactionsEnum.TRANSFER,
      before_balance: 20,
      after_balance: 0,
      transaction_id: 1,
      receiver_account_id: 20
    });
  });

  it('should throw if is same account', async () => {
    const { sut, makeException } = makeSut();

    try {
      await sut.execute(1, 1, 20);
    } catch (error) {
      expect(makeException.badRequest).toHaveBeenCalledWith({
        message: 'Invalid Transfer Operation!'
      });
      expect(makeException.badRequest).toHaveBeenCalledTimes(1);
      expect(error).toBeInstanceOf(Error);
    }
  });
  it('should throw if sender account not found', async () => {
    const { sut, makeAccountRepository, makeException } = makeSut();
    jest.spyOn(makeAccountRepository, 'findById').mockReturnValue(null);

    try {
      await sut.execute(1, 2, 20);
    } catch (error) {
      expect(makeException.notFound).toHaveBeenCalledWith({
        message: 'Sender account not found!'
      });
      expect(makeException.notFound).toHaveBeenCalledTimes(1);
      expect(error).toBeInstanceOf(Error);
    }
  });
  it('should throw if receiver account not found', async () => {
    const { sut, makeAccountRepository, makeException } = makeSut();

    jest
      .spyOn(makeAccountRepository, 'findById')
      .mockImplementationOnce(() => Promise.resolve({ ...accountMock, id: 1 }))
      .mockImplementationOnce(() => Promise.resolve(null));

    try {
      await sut.execute(1, 2, 20);
    } catch (error) {
      expect(makeException.notFound).toHaveBeenCalledWith({
        message: 'Receiver account not found!'
      });
      expect(makeException.notFound).toHaveBeenCalledTimes(1);
    }
  });
  it('should throw if sender account balance is insufficient', async () => {
    const { sut, makeAccountRepository, makeException } = makeSut();
    jest.clearAllMocks();
    jest
      .spyOn(makeAccountRepository, 'findById')
      .mockReturnValueOnce(
        Promise.resolve({ ...accountMock, id: 1, balance: 0 })
      );

    try {
      await sut.execute(1, 2, 20);
    } catch (error) {
      expect(makeException.badRequest).toHaveBeenCalledWith({
        message: 'Transaction error! Your balance is insufficient!'
      });
      expect(makeException.badRequest).toHaveBeenCalledTimes(1);
    }
  });
});
