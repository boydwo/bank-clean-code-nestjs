import { ShowAccountUseCases } from 'src/app/usecases/account/showAccount.usecases';
import { IException } from 'src/domain/protocols/exceptions/exceptions.interface';
import { IAccountRepository } from 'src/domain/protocols/repositories/account.repository.interface';
import { accountMock } from 'test/unit/mocks/account.mock';

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

  const makeException: IException = {
    badRequest: jest.fn(),
    forbidden: jest.fn(),
    internalServerError: jest.fn(),
    unauthorized: jest.fn(),
    notFound: jest.fn(),
  };

  const sut = new ShowAccountUseCases(makeAccountRepository, makeException);
  return { sut, makeAccountRepository, makeException };
};
describe('app :: usecases :: account :: ShowAccountUseCases', () => {
  it('should call AccountRepository with correct values', async () => {
    const { sut, makeAccountRepository } = makeSut();

    await sut.execute(1);

    expect(makeAccountRepository.findById).toHaveBeenCalledWith(1);
  });
  it('should throw if account already exists', async () => {
    const { sut, makeAccountRepository, makeException } = makeSut();
    jest
      .spyOn(makeAccountRepository, 'findById')
      .mockReturnValueOnce(Promise.resolve(null));

    await sut.execute(1);

    expect(makeException.notFound).toHaveBeenCalledWith({
      message: 'Account not found!',
    });
  });
});
