import { roleTransactionsEnum } from 'src/domain/enum/roleTransactions.enum';
import { typeTransactionsEnum } from 'src/domain/enum/typeTransactions.enum';

export type IDepositResponse = {
  account_id: number;
  value: number;
  role: roleTransactionsEnum;
  type: typeTransactionsEnum;
  before_balance: number;
  after_balance: number;
  transaction_id: number;
};

export interface IMakeDepositAccountUsecases {
  execute(account_id: number, value: number): Promise<IDepositResponse | Error>;
}
