import { Module } from '@nestjs/common';
import { AccountPrismaDatabaseAdapter } from './prisma/adapters/accountPrisma.adapter';
import { TransactionAccountPrismaDatabaseAdapter } from './prisma/adapters/transactionAccountPrisma.adapter';
import { TransactionPrismaDatabaseAdapter } from './prisma/adapters/transactionPrisma.adapter';
import { PrismaServiceClient } from './prisma/prisma.service.client';

@Module({
  imports: [],
  providers: [
    PrismaServiceClient,
    {
      inject: [PrismaServiceClient],
      provide: AccountPrismaDatabaseAdapter,
      useFactory: (prismaClient: PrismaServiceClient) =>
        new AccountPrismaDatabaseAdapter(prismaClient),
    },
    {
      inject: [PrismaServiceClient],
      provide: TransactionPrismaDatabaseAdapter,
      useFactory: (prismaClient: PrismaServiceClient) =>
        new TransactionPrismaDatabaseAdapter(prismaClient),
    },
    {
      inject: [PrismaServiceClient],
      provide: TransactionAccountPrismaDatabaseAdapter,
      useFactory: (prismaClient: PrismaServiceClient) =>
        new TransactionAccountPrismaDatabaseAdapter(prismaClient),
    },
  ],
  exports: [
    AccountPrismaDatabaseAdapter,
    TransactionPrismaDatabaseAdapter,
    TransactionAccountPrismaDatabaseAdapter,
  ],
})
export class DatabaseModule {}
