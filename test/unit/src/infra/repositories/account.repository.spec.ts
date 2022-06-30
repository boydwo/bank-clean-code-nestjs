import { IDatabaseClient } from 'src/domain/protocols/database/databaseClient.interface';
import { AccountRepository } from 'src/infra/repositories/account.repository';

interface SutTypes {
  sut: AccountRepository;
  makeDatabaseAdapter: IDatabaseClient;
}

const makeSut = (): SutTypes => {
  const makeDatabaseAdapter: IDatabaseClient = {
    create: jest.fn(),
    findAll: jest.fn(),
    findAllWithArgs: jest.fn(),
    delete: jest.fn(),
    findBy: jest.fn(),
    update: jest.fn(),
  };

  const sut = new AccountRepository(makeDatabaseAdapter);
  return { sut, makeDatabaseAdapter };
};
describe('app :: infra :: repositories :: AccountRepository', () => {
  it('should call create method with correct values', async () => {
    const { sut, makeDatabaseAdapter } = makeSut();
    const fakeData = {
      name: 'John Doe',
      document: '9999999999',
      email: 'john@doe.com',
      telephone: '55319999999',
      address: 'Av das Palmeiras, 444, Bandeiranantes, 32415788, São Paulo, SP',
    };

    await sut.create(
      'John Doe',
      '9999999999',
      'john@doe.com',
      '55319999999',
      'Av das Palmeiras, 444, Bandeiranantes, 32415788, São Paulo, SP',
    );

    expect(makeDatabaseAdapter.create).toHaveBeenCalledWith(fakeData);
  });
  it('should call findAll method with correct values', async () => {
    const { sut, makeDatabaseAdapter } = makeSut();

    await sut.findAll();

    expect(makeDatabaseAdapter.findAll).toHaveBeenCalled();
  });
  it('should call findById method with correct values', async () => {
    const { sut, makeDatabaseAdapter } = makeSut();

    await sut.findById(1);

    expect(makeDatabaseAdapter.findBy).toHaveBeenCalledWith({ id: 1 });
  });

  it('should call findByDocument method with correct values', async () => {
    const { sut, makeDatabaseAdapter } = makeSut();

    await sut.findByDocument('9999999999');

    expect(makeDatabaseAdapter.findBy).toHaveBeenCalledWith({
      document: '9999999999',
    });
  });
  it('should call update method with correct values', async () => {
    const { sut, makeDatabaseAdapter } = makeSut();

    await sut.update(1, {
      name: 'John Doe',
      address: 'Av das Palmeiras, 444, Bandeiranantes, 32415788, São Paulo, SP',
      email: 'johnDoe@gmail.com',
      telephone: '555-555-5555',
    });

    expect(makeDatabaseAdapter.update).toHaveBeenCalledWith({
      id: 1,
      account: {
        name: 'John Doe',
        address:
          'Av das Palmeiras, 444, Bandeiranantes, 32415788, São Paulo, SP',
        email: 'johnDoe@gmail.com',
        telephone: '555-555-5555',
      },
    });
  });

  it('should call deleteById method with correct values', async () => {
    const { sut, makeDatabaseAdapter } = makeSut();

    await sut.deleteById(1);

    expect(makeDatabaseAdapter.delete).toHaveBeenCalledWith(1);
  });
});
