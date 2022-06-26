import { transactionsTypeEnum } from '../enum/typeTransactions.enum';

export type TransactionModel = {
  id?: string;
  type: transactionsTypeEnum;
  value: number;
  created_at: Date;
};
