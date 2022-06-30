import { typeTransactionsEnum } from '../enum/typeTransactions.enum';
import { TransactionAccountsModel } from './transactionAccounts.model';

export type TransactionModel = {
  id?: number;
  type: typeTransactionsEnum;
  value: number;
  createdAt: string;
  transaction_accounts?: TransactionAccountsModel[];
};
