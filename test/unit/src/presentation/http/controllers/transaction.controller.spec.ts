import { IGetBalanceAccountUsecases } from 'src/domain/protocols/usecases/transaction/geBalanceAccount.usecases';
import { IGetStatementAccountUsecases } from 'src/domain/protocols/usecases/transaction/getStatementAccount.usecases.interface';
import { IMakeDepositAccountUsecases } from 'src/domain/protocols/usecases/transaction/makeDepositAccount.usecases.interface';
import { IMakeWithdrawalUsecases } from 'src/domain/protocols/usecases/transaction/makeWithdrawalAccount.usecases.interface';
import { ITransferBetweenAccountsUsecases } from 'src/domain/protocols/usecases/transaction/transferBetweenAccounts.usecases.interface';
import { TransactionController } from 'src/presentation/http/controllers/transaction.controller';

interface SutTypes {
  sut: TransactionController;
  makeDepositAccountUsecases: IMakeDepositAccountUsecases;
  getBalanceAccountUsecases: IGetBalanceAccountUsecases;
  makeWithdrawalUsecases: IMakeWithdrawalUsecases;
  transferBetweenAccountsUsecases: ITransferBetweenAccountsUsecases;
  getStatementAccountUsecases: IGetStatementAccountUsecases;
}

const makeSut = (): SutTypes => {
  const makeDepositAccountUsecases: IMakeDepositAccountUsecases = {
    execute: jest.fn()
  };
  const getBalanceAccountUsecases: IGetBalanceAccountUsecases = {
    execute: jest.fn()
  };
  const makeWithdrawalUsecases: IMakeWithdrawalUsecases = {
    execute: jest.fn()
  };

  const transferBetweenAccountsUsecases: ITransferBetweenAccountsUsecases = {
    execute: jest.fn()
  };
  const getStatementAccountUsecases: IGetStatementAccountUsecases = {
    execute: jest.fn()
  };

  const sut = new TransactionController(
    makeDepositAccountUsecases,
    getBalanceAccountUsecases,
    makeWithdrawalUsecases,
    transferBetweenAccountsUsecases,
    getStatementAccountUsecases
  );
  return {
    sut,
    makeDepositAccountUsecases,
    getBalanceAccountUsecases,
    makeWithdrawalUsecases,
    transferBetweenAccountsUsecases,
    getStatementAccountUsecases
  };
};
describe('app :: presentation :: http :: TransactionController', () => {
  const accountData = {
    name: 'John Doe',
    document: '9999999999',
    email: 'john@doe.com',
    telephone: '55319999999',
    address: 'Av das Palmeiras, 444, Bandeiranantes, 32415788, São Paulo, SP'
  };

  it('should call getBalanceAccount method with correct values', async () => {
    const { sut, getBalanceAccountUsecases } = makeSut();

    await sut.getBalanceAccount(1);

    expect(getBalanceAccountUsecases.execute).toHaveBeenCalledWith(1);
  });
  it('should call getStatementAccount method with correct values', async () => {
    const { sut, getStatementAccountUsecases } = makeSut();

    await sut.getStatementAccount(1);

    expect(getStatementAccountUsecases.execute).toHaveBeenCalledWith(1);
  });
  it('should call makeDepositAccount method with correct values', async () => {
    const { sut, makeDepositAccountUsecases } = makeSut();

    await sut.makeDepositAccount({ account_id: 1, value: 20 });

    expect(makeDepositAccountUsecases.execute).toHaveBeenCalledWith(1, 20);
  });
  it('should call makeWithdrawalAccount method with correct values', async () => {
    const { sut, makeWithdrawalUsecases } = makeSut();

    await sut.makeWithdrawalAccount({ account_id: 1, value: 20 });

    expect(makeWithdrawalUsecases.execute).toHaveBeenCalledWith(1, 20);
  });
  it('should call makeWithdrawalAccount method with correct values', async () => {
    const { sut, transferBetweenAccountsUsecases } = makeSut();

    await sut.transferBetweenAccounts({
      sender_account_id: 1,
      receiver_account_id: 2,
      value: 20
    });

    expect(transferBetweenAccountsUsecases.execute).toHaveBeenCalledWith(
      1,
      2,
      20
    );
  });
});
