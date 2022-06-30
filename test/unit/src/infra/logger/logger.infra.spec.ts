import { Logger } from '@nestjs/common';
import { LoggerService } from 'src/infra/logger/logger.infra';

const mockedLogger = Logger as jest.Mocked<typeof Logger>;
mockedLogger.log = jest.fn();
mockedLogger.error = jest.fn();
mockedLogger.debug = jest.fn();
mockedLogger.verbose = jest.fn();
mockedLogger.warn = jest.fn();

interface SutTypes {
  sut: LoggerService;
}

const makeSut = (): SutTypes => {
  const sut = new LoggerService();
  return { sut };
};
describe('app :: infra :: exception :: LoggerService  ', () => {
  it('should call info method with correct values', () => {
    const { sut } = makeSut();

    sut.info('context', 'message');

    expect(Logger.log).toHaveBeenCalledWith('[INFO] message', 'context');
  });
  it('should call error method with correct values', () => {
    const { sut } = makeSut();

    sut.error('context', 'message');

    expect(Logger.error).toHaveBeenCalledWith(
      '[ERROR] message',
      undefined,
      'context'
    );
  });
  it('should call debug method with correct values', () => {
    const { sut } = makeSut();

    sut.debug('context', 'message');

    expect(Logger.debug).toHaveBeenCalledWith('[DEBUG] message', 'context');
  });
  it('should call verbose method with correct values', () => {
    const { sut } = makeSut();

    sut.verbose('context', 'message');

    expect(Logger.debug).toHaveBeenCalledWith('[DEBUG] message', 'context');
  });
  it('should call warn verbose method with correct values', () => {
    const { sut } = makeSut();

    sut.warn('context', 'message');

    expect(Logger.warn).toHaveBeenCalledWith('[WARN] message', 'context');
  });
});
