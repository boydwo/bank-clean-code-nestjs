import { IException } from 'src/domain/protocols/exceptions/exceptions.interface';
import { ILogger } from 'src/domain/protocols/logger/logger.interface';

export const makeExceptionMock: IException = {
  badRequest: jest.fn().mockReturnValueOnce(new Error()),
  forbidden: jest.fn().mockReturnValueOnce(new Error()),
  internalServerError: jest.fn().mockReturnValueOnce(new Error()),
  unauthorized: jest.fn().mockReturnValueOnce(new Error()),
  notFound: jest.fn().mockReturnValueOnce(new Error()),
};

export const makeLoggerMock: ILogger = {
  info: jest.fn(),
  debug: jest.fn(),
  error: jest.fn(),
  verbose: jest.fn(),
  warn: jest.fn(),
};
