import { CreateAccountUseCases } from 'src/app/usecases/account/createAccount.usecases';
import { IException } from 'src/domain/protocols/exceptions/exceptions.interface';
import { IAccountRepository } from 'src/domain/protocols/repositories/account.repository.interface';
import { accountMock } from 'test/unit/mocks/account.mock';

interface SutTypes {
  sut: CreateAccountUseCases;
  makeAccountRepository: IAccountRepository;
  makeException: IException;
}

const makeSut = (): SutTypes => {
  const makeAccountRepository: IAccountRepository = {
    create: jest.fn().mockReturnValue(accountMock),
    findAll: jest.fn(),
    deleteById: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    findByDocument: jest.fn().mockReturnValue(null),
  };

  const makeException: IException = {
    badRequest: jest.fn(),
    forbidden: jest.fn(),
    internalServerError: jest.fn(),
    Unauthorized: jest.fn(),
  };

  const sut = new CreateAccountUseCases(makeAccountRepository, makeException);
  return { sut, makeAccountRepository, makeException };
};
describe('app :: usecases :: account :: CreateAccountUseCases', () => {
  it('should call AccountRepository with correct values', async () => {
    const { sut, makeAccountRepository } = makeSut();

    await sut.execute(accountMock);

    expect(makeAccountRepository.create).toHaveBeenCalledWith(accountMock);
  });
  it('should throw if account already exists', async () => {
    const { sut, makeAccountRepository, makeException } = makeSut();
    jest
      .spyOn(makeAccountRepository, 'findByDocument')
      .mockReturnValueOnce(Promise.resolve(accountMock));

    await sut.execute(accountMock);

    expect(makeException.badRequest).toHaveBeenCalledWith({
      message: 'Account already exists!',
    });
  });
});
