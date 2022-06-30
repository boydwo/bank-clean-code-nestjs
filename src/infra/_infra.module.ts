import { Module } from '@nestjs/common';
import { ExceptionsService } from './exceptions/exceptions.infra';
import { LoggerService } from './logger/logger.infra';
import { RepositoriesModule } from './repositories/_repositories.module';

@Module({
  imports: [RepositoriesModule],
  providers: [ExceptionsService, LoggerService],
  exports: [RepositoriesModule, ExceptionsService, LoggerService]
})
export class InfraModule {}
