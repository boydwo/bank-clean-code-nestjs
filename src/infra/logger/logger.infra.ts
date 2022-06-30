import { Logger } from '@nestjs/common';
import { ILogger } from 'src/domain/protocols/logger/logger.interface';

export class LoggerService implements ILogger {
  debug(context: string, message: string) {
    if (process.env.NODE_ENV !== 'production') {
      Logger.debug(`[DEBUG] ${message}`, context);
    }
  }
  info(context: string, message: string) {
    Logger.log(`[INFO] ${message}`, context);
  }
  error(context: string, message: string, trace?: string) {
    Logger.error(`[ERROR] ${message}`, trace, context);
  }
  warn(context: string, message: string) {
    Logger.warn(`[WARN] ${message}`, context);
  }
  verbose(context: string, message: string) {
    if (process.env.NODE_ENV !== 'production') {
      Logger.verbose(`[VERBOSE] ${message}`, context);
    }
  }
}
