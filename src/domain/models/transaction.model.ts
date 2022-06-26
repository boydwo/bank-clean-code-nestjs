import { typeTransactionsEnum } from '../enum/typeTransactions.enum';

export type TransactionModel = {
  id?: number;
  type: typeTransactionsEnum;
  value: number;
  created_at: Date;
};
