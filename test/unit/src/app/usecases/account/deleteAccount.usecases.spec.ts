import { DeleteAccountUseCases } from 'src/app/usecases/account/deleteAccount.usecases';
import { IException } from 'src/domain/protocols/exceptions/exceptions.interface';
import { ILogger } from 'src/domain/protocols/logger/logger.interface';
import { IAccountRepository } from 'src/domain/protocols/repositories/account.repository.interface';
import { accountMock } from 'test/unit/mocks/account.mock';
import {
  makeExceptionMock,
  makeLoggerMock
} from 'test/unit/mocks/factory.mock';

interface SutTypes {
  sut: DeleteAccountUseCases;
  makeAccountRepository: IAccountRepository;
  makeLogger: ILogger;
  makeException: IException;
}

const makeSut = (): SutTypes => {
  const makeAccountRepository: IAccountRepository = {
    create: jest.fn().mockReturnValue(accountMock),
    findAll: jest.fn(),
    deleteById: jest.fn(),
    findById: jest.fn().mockReturnValue({ ...accountMock, id: 1 }),
    update: jest.fn(),
    findByDocument: jest.fn().mockReturnValue(null)
  };

  const makeLogger = makeLoggerMock;
  const makeException = makeExceptionMock;
  const sut = new DeleteAccountUseCases(
    makeAccountRepository,
    makeLogger,
    makeException
  );
  return { sut, makeAccountRepository, makeLogger, makeException };
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
      'Account ID:1 has been deleted'
    );
  });
  it('should throw if account already exists', async () => {
    const { sut, makeAccountRepository, makeException } = makeSut();
    jest
      .spyOn(makeAccountRepository, 'findById')
      .mockReturnValueOnce(Promise.resolve(null));

    try {
      await sut.execute(1);
    } catch (error) {
      expect(makeException.notFound).toHaveBeenCalledWith({
        message: 'Account not found!'
      });
      expect(error).toBeInstanceOf(Error);
    }
  });
});
