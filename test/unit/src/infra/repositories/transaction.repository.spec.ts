import { typeTransactionsEnum } from 'src/domain/enum/typeTransactions.enum';
import { IDatabaseClient } from 'src/domain/protocols/database/databaseClient.interface';
import { TransactionRepository } from 'src/infra/repositories/transaction.repository';
import { makeDatabaseAdapterMock } from 'test/unit/mocks/factory.mock';

interface SutTypes {
  sut: TransactionRepository;
  makeDatabaseAdapter: IDatabaseClient;
}

const makeSut = (): SutTypes => {
  const makeDatabaseAdapter = makeDatabaseAdapterMock;
  const sut = new TransactionRepository(makeDatabaseAdapter);
  return { sut, makeDatabaseAdapter };
};
describe('app :: infra :: repositories :: TransactionRepository', () => {
  it('should call create method with correct values', async () => {
    const { sut, makeDatabaseAdapter } = makeSut();

    await sut.create(typeTransactionsEnum.DEPOSIT, 20);

    expect(makeDatabaseAdapter.create).toHaveBeenCalledWith({
      type: 'DEPOSIT',
      value: 20
    });
  });
  it('should call findById method with correct values', async () => {
    const { sut, makeDatabaseAdapter } = makeSut();

    await sut.findById(1);

    expect(makeDatabaseAdapter.findBy).toHaveBeenCalledWith({ id: 1 });
  });
});
