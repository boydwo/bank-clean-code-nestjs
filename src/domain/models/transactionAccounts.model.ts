import { roleTransactionsEnum } from '../enum/roleTransactions.enum';

export type TransferAccountsModel = {
  id?: string;
  account_id: number;
  transaction_id: number;
  role: roleTransactionsEnum;
  value: number;
  before_balance: number;
  after_balance: number;
};
