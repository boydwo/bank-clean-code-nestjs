import { typeTransactionsEnum } from '../enum/typeTransactions.enum';
import { TransactionAccountsModel } from './transactionAccounts.model';

export type TransactionModel = {
  id?: number;
  type: typeTransactionsEnum;
  value: number;
  created_at: string;
  transactionAccounts?: TransactionAccountsModel[];
};
