import { TransactionAccountsModel } from './transactionAccounts.model';

export type AccountModel = {
  id?: number;
  name: string;
  email: string;
  document: string;
  telephone?: string;
  address: string;
  balance: number;
  transactions_accounts?: TransactionAccountsModel[];
};
