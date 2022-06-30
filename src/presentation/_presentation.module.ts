import { Module } from '@nestjs/common';
import { CreateAccountUseCases } from 'src/app/usecases/account/createAccount.usecases';
import { DeleteAccountUseCases } from 'src/app/usecases/account/deleteAccount.usecases';
import { ShowAccountUseCases } from 'src/app/usecases/account/showAccount.usecases';
import { UpdateAccountUseCases } from 'src/app/usecases/account/updateAccount.usecases';
import { GetBalanceAccountUsecases } from 'src/app/usecases/transaction/getBalanceAccount.usecases';
import { GetStatementAccountUsecases } from 'src/app/usecases/transaction/getStatementAccount.usecases';
import { MakeDepositAccountUsecases } from 'src/app/usecases/transaction/makeDepositAccount.usecases';
import { MakeWithdrawalAccountUsecases } from 'src/app/usecases/transaction/makeWithdrawalAccount.usecases';
import { TransferBetweenAccountsUsecases } from 'src/app/usecases/transaction/transferBetweenAccounts.usecases';
import { ExceptionsService } from 'src/infra/exceptions/exceptions.infra';
import { LoggerService } from 'src/infra/logger/logger.infra';
import { AccountRepository } from 'src/infra/repositories/account.repository';
import { TransactionRepository } from 'src/infra/repositories/transaction.repository';
import { TransactionAccountRepository } from 'src/infra/repositories/transactionAccounts.repository';
import { InfraModule } from 'src/infra/_infra.module';
import { AccountController } from './http/controllers/account.controller';
import { TransactionController } from './http/controllers/transaction.controller';

@Module({
  imports: [InfraModule],
  controllers: [AccountController, TransactionController],
  providers: [
    {
      inject: [AccountRepository, ExceptionsService, LoggerService],
      provide: 'CreateAccountUseCases',
      useFactory: (
        accountRepository: AccountRepository,
        exception: ExceptionsService,
        logger: LoggerService
      ) => new CreateAccountUseCases(accountRepository, exception, logger)
    },
    {
      inject: [AccountRepository, ExceptionsService],
      provide: 'ShowAccountUseCases',
      useFactory: (
        accountRepository: AccountRepository,
        exception: ExceptionsService
      ) => new ShowAccountUseCases(accountRepository, exception)
    },
    {
      inject: [AccountRepository, ExceptionsService, LoggerService],
      provide: 'UpdateAccountUseCases',
      useFactory: (
        accountRepository: AccountRepository,
        exception: ExceptionsService,
        logger: LoggerService
      ) => new UpdateAccountUseCases(accountRepository, exception, logger)
    },
    {
      inject: [AccountRepository, LoggerService],
      provide: 'DeleteAccountUseCases',
      useFactory: (
        accountRepository: AccountRepository,
        logger: LoggerService
      ) => new DeleteAccountUseCases(accountRepository, logger)
    },
    {
      inject: [
        AccountRepository,
        TransactionRepository,
        TransactionAccountRepository,
        ExceptionsService,
        LoggerService
      ],
      provide: 'MakeDepositAccountUseCases',
      useFactory: (
        accountRepository: AccountRepository,
        transactionRepository: TransactionRepository,
        transactionAccountRepository: TransactionAccountRepository,
        exception: ExceptionsService,
        logger: LoggerService
      ) =>
        new MakeDepositAccountUsecases(
          accountRepository,
          transactionRepository,
          transactionAccountRepository,
          exception,
          logger
        )
    },
    {
      inject: [AccountRepository, ExceptionsService],
      provide: 'GetBalanceAccountUsecases',
      useFactory: (
        accountRepository: AccountRepository,
        exception: ExceptionsService
      ) => new GetBalanceAccountUsecases(accountRepository, exception)
    },
    {
      inject: [
        AccountRepository,
        TransactionRepository,
        TransactionAccountRepository,
        ExceptionsService,
        LoggerService
      ],
      provide: 'MakeWithdrawalAccountUsecases',
      useFactory: (
        accountRepository: AccountRepository,
        transactionRepository: TransactionRepository,
        transactionAccountRepository: TransactionAccountRepository,
        exception: ExceptionsService,
        logger: LoggerService
      ) =>
        new MakeWithdrawalAccountUsecases(
          accountRepository,
          transactionRepository,
          transactionAccountRepository,
          exception,
          logger
        )
    },
    {
      inject: [
        AccountRepository,
        TransactionRepository,
        TransactionAccountRepository,
        ExceptionsService,
        LoggerService
      ],
      provide: 'TransferBetweenAccountsUsecases',
      useFactory: (
        accountRepository: AccountRepository,
        transactionRepository: TransactionRepository,
        transactionAccountRepository: TransactionAccountRepository,
        exception: ExceptionsService,
        logger: LoggerService
      ) =>
        new TransferBetweenAccountsUsecases(
          accountRepository,
          transactionRepository,
          transactionAccountRepository,
          exception,
          logger
        )
    },
    {
      inject: [
        AccountRepository,
        TransactionAccountRepository,
        ExceptionsService
      ],
      provide: 'GetStatementAccountUsecases',
      useFactory: (
        accountRepository: AccountRepository,

        transactionAccountRepository: TransactionAccountRepository,
        exception: ExceptionsService
      ) =>
        new GetStatementAccountUsecases(
          accountRepository,
          transactionAccountRepository,
          exception
        )
    }
  ]
})
export class PresentationModule {}
