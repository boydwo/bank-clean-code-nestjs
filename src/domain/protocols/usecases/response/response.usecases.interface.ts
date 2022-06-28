import { roleTransactionsEnum } from 'src/domain/enum/roleTransactions.enum';
import { typeTransactionsEnum } from 'src/domain/enum/typeTransactions.enum';

export type IStatementResponse = {
  account_id: number;
  value: number;
  role: roleTransactionsEnum;
  type: typeTransactionsEnum;
  before_balance: number;
  after_balance: number;
  transaction_id: number;
  receiver_account_id?: number;
};
