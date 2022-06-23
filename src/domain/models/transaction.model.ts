import { subTypeTransactionsEnum } from '../enum/subTypeTransactions.enum';
import { transactionsTypeEnum } from '../enum/typeTransactions.enum';

export type TransactionModel = {
  id: string;
  type: transactionsTypeEnum;
  sub_type: subTypeTransactionsEnum;
  value: string;
  created_at: Date;
  before_balance: number;
  after_balance: number;
};
