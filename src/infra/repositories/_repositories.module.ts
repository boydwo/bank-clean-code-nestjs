import { Module } from '@nestjs/common';
import { AccountPrismaDatabaseAdapter } from '../database/prisma/adapters/accountPrisma.adapter';
import { TransactionAccountPrismaDatabaseAdapter } from '../database/prisma/adapters/transactionAccountPrisma.adapter';
import { TransactionPrismaDatabaseAdapter } from '../database/prisma/adapters/transactionPrisma.adapter';
import { DatabaseModule } from '../database/_database.module';
import { AccountRepository } from './account.repository';
import { TransactionRepository } from './transaction.repository';
import { TransactionAccountRepository } from './transactionAccounts.repository';

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      inject: [AccountPrismaDatabaseAdapter],
      provide: AccountRepository,
      useFactory: (database: AccountPrismaDatabaseAdapter) =>
        new AccountRepository(database)
    },
    {
      inject: [TransactionAccountPrismaDatabaseAdapter],
      provide: TransactionAccountRepository,
      useFactory: (database: TransactionAccountPrismaDatabaseAdapter) =>
        new TransactionAccountRepository(database)
    },
    {
      inject: [TransactionPrismaDatabaseAdapter],
      provide: TransactionRepository,
      useFactory: (database: TransactionPrismaDatabaseAdapter) =>
        new TransactionRepository(database)
    }
  ],
  exports: [
    AccountRepository,
    TransactionAccountRepository,
    TransactionRepository
  ]
})
export class RepositoriesModule {}
