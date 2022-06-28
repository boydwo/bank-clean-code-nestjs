import { ShowAccountUseCases } from 'src/app/usecases/account/showAccount.usecases';
import { IException } from 'src/domain/protocols/exceptions/exceptions.interface';
import { IAccountRepository } from 'src/domain/protocols/repositories/account.repository.interface';
import { accountMock } from 'test/unit/mocks/account.mock';
import { makeExceptionMock } from 'test/unit/mocks/factory.mock';

interface SutTypes {
  sut: ShowAccountUseCases;
  makeAccountRepository: IAccountRepository;
  makeException: IException;
}

const makeSut = (): SutTypes => {
  const makeAccountRepository: IAccountRepository = {
    create: jest.fn().mockReturnValue(accountMock),
    findAll: jest.fn(),
    deleteById: jest.fn(),
    findById: jest.fn().mockReturnValue({ ...accountMock, id: 1 }),
    update: jest.fn(),
    findByDocument: jest.fn().mockReturnValue(null),
  };

  const makeException = makeExceptionMock;
  const sut = new ShowAccountUseCases(makeAccountRepository, makeException);
  return { sut, makeAccountRepository, makeException };
};
describe('app :: usecases :: account :: ShowAccountUseCases', () => {
  it('should call AccountRepository with correct values', async () => {
    const { sut, makeAccountRepository } = makeSut();

    await sut.execute(1);

    expect(makeAccountRepository.findById).toHaveBeenCalledWith(1);
  });
  it('should returncorrect values', async () => {
    const { sut } = makeSut();

    const response = await sut.execute(1);

    expect(response).toEqual({
      email: 'johnDoe',
      id: 1,
      address: 'Av das Palmeiras, 444, Bandeiranantes, 32415788, São Paulo, SP',
      balance: 20,
      document: '9999999999',
      name: 'John Doe',
      telephone: '55319999999',
    });
  });
  it('should throw if account not found', async () => {
    const { sut, makeAccountRepository, makeException } = makeSut();
    jest
      .spyOn(makeAccountRepository, 'findById')
      .mockReturnValueOnce(Promise.resolve(null));

    try {
      await sut.execute(1);
    } catch (error) {
      expect(makeException.notFound).toHaveBeenCalledWith({
        message: 'Account not found!',
      });
      expect(error).toBeInstanceOf(Error);
    }
  });
});
