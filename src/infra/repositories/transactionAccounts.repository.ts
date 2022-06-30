import { roleTransactionsEnum } from 'src/domain/enum/roleTransactions.enum';
import { TransactionAccountsModel } from 'src/domain/models/transactionAccounts.model';
import { IDatabaseClient } from 'src/domain/protocols/database/databaseClient.interface';
import { ITransactionAccountRepository } from 'src/domain/protocols/repositories/transactionAccount.repository.interface';

export class TransactionAccountRepository
  implements ITransactionAccountRepository
{
  constructor(private readonly database: IDatabaseClient) {}

  async create(
    account_id: number,
    transaction_id: number,
    role: roleTransactionsEnum,
    value: number,
    before_balance: number,
    after_balance: number
  ): Promise<TransactionAccountsModel> {
    const accountCreated = await this.database.create({
      account_id,
      transaction_id,
      role,
      value,
      before_balance,
      after_balance
    });
    return accountCreated;
  }
  async findAll(): Promise<TransactionAccountsModel[]> {
    const accounts = await this.database.findAll();
    return accounts;
  }

  async findAllByAccountIdWithTransactionAndAccounts(
    account_id: number
  ): Promise<TransactionAccountsModel[]> {
    const account = await this.database.findAllWithArgs({
      account_id
    });
    return account;
  }
}
