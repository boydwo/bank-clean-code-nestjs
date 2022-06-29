import { roleTransactionsEnum } from '../enum/roleTransactions.enum';
import { TransactionModel } from './transaction.model';

export type TransactionAccountsModel = {
  id?: number;
  account_id: number;
  transaction_id: number;
  transaction?: TransactionModel;
  role: roleTransactionsEnum;
  value: number;
  before_balance: number;
  after_balance: number;
};
