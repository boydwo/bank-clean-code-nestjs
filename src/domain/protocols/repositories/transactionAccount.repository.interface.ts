import { roleTransactionsEnum } from 'src/domain/enum/roleTransactions.enum';
import { TransactionAccountsModel } from 'src/domain/models/transactionAccounts.model';

export interface ITransactionAccountRepository {
  create(
    account_id: number,
    transaction_id: number,
    role: roleTransactionsEnum,
    value: number,
    before_balance: number,
    after_balance: number,
  ): Promise<TransactionAccountsModel>;
  findAll(): Promise<TransactionAccountsModel[]>;
  findAllByAccountId(account_id: number): Promise<TransactionAccountsModel[]>;
}
