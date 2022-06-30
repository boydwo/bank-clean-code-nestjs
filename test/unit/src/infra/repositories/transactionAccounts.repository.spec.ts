import { roleTransactionsEnum } from 'src/domain/enum/roleTransactions.enum';
import { IDatabaseClient } from 'src/domain/protocols/database/databaseClient.interface';
import { TransactionAccountRepository } from 'src/infra/repositories/transactionAccounts.repository';
import { makeDatabaseAdapterMock } from 'test/unit/mocks/factory.mock';

interface SutTypes {
  sut: TransactionAccountRepository;
  makeDatabaseAdapter: IDatabaseClient;
}

const makeSut = (): SutTypes => {
  const makeDatabaseAdapter = makeDatabaseAdapterMock;

  const sut = new TransactionAccountRepository(makeDatabaseAdapter);
  return { sut, makeDatabaseAdapter };
};
describe('app :: infra :: repositories :: TransactionAccountRepository', () => {
  it('should call create method with correct values', async () => {
    const { sut, makeDatabaseAdapter } = makeSut();

    await sut.create(1, 1, roleTransactionsEnum.ADD, 20, 0, 20);

    expect(makeDatabaseAdapter.create).toHaveBeenCalledWith({
      account_id: 1,
      transaction_id: 1,
      role: roleTransactionsEnum.ADD,
      value: 20,
      before_balance: 0,
      after_balance: 20
    });
  });
  it('should call findAll method with correct values', async () => {
    const { sut, makeDatabaseAdapter } = makeSut();

    await sut.findAll();

    expect(makeDatabaseAdapter.findAll).toHaveBeenCalled();
  });
  it('should call findAllByAccountIdWithTransactionAndAccounts method with correct values', async () => {
    const { sut, makeDatabaseAdapter } = makeSut();

    await sut.findAllByAccountIdWithTransactionAndAccounts(1);

    expect(makeDatabaseAdapter.findAllWithArgs).toHaveBeenCalledWith({
      account_id: 1
    });
  });
});
