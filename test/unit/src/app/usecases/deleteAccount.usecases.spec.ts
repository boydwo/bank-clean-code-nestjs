import { DeleteAccountUseCases } from 'src/app/usecases/account/deleteAccount.usecases';
import { ILogger } from 'src/domain/protocols/logger/logger.interface';
import { IAccountRepository } from 'src/domain/protocols/repositories/account.repository.interface';
import { accountMock } from 'test/unit/mocks/account.mock';

interface SutTypes {
  sut: DeleteAccountUseCases;
  makeAccountRepository: IAccountRepository;
  makeLogger: ILogger;
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

  const makeLogger: ILogger = {
    info: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
    verbose: jest.fn(),
    warn: jest.fn(),
  };
  const sut = new DeleteAccountUseCases(makeAccountRepository, makeLogger);
  return { sut, makeAccountRepository, makeLogger };
};
describe('app :: usecases :: account :: DeleteAccountUseCases', () => {
  it('should call AccountRepository with correct values', async () => {
    const { sut, makeAccountRepository } = makeSut();

    await sut.execute(1);

    expect(makeAccountRepository.deleteById).toHaveBeenCalledWith(1);
  });
  it('should call logger with correct values', async () => {
    const { sut, makeLogger } = makeSut();

    await sut.execute(1);

    expect(makeLogger.info).toHaveBeenCalledWith(
      'DeleteAccountUseCases.execute',
      'Account ID:1 has been deleted',
    );
  });
});
