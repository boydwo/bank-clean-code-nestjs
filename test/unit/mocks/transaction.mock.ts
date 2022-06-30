import { roleTransactionsEnum } from 'src/domain/enum/roleTransactions.enum';
import { typeTransactionsEnum } from 'src/domain/enum/typeTransactions.enum';
import { TransactionAccountsModel } from 'src/domain/models/transactionAccounts.model';

export const transactionAccountDepositMock: TransactionAccountsModel = {
  account_id: 1,
  transaction_id: 1,
  value: 20,
  role: roleTransactionsEnum.ADD,
  id: 1,
  before_balance: 0,
  after_balance: 20,
  transaction: {
    id: 1,
    createdAt: new Date(2022, 1, 2).toISOString(),
    type: typeTransactionsEnum.DEPOSIT,
    value: 20,
    transaction_accounts: [
      {
        account_id: 1,
        transaction_id: 1,
        value: 20,
        role: roleTransactionsEnum.ADD,
        id: 1,
        before_balance: 0,
        after_balance: 20,
        account: {
          id: 2,
          name: 'John Doe 2',
          email: 'johnDoe',
          document: '9999999999',
          telephone: '55319999999',
          address:
            'Av das Palmeiras, 444, Bandeiranantes, 32415788, São Paulo, SP',
          balance: 20
        }
      }
    ]
  },
  account: {
    id: 1,
    name: 'John',
    email: 'johnDoe',
    document: '9999999999',
    telephone: '55319999999',
    address: 'Av das Palmeiras, 444, Bandeiranantes, 32415788, São Paulo, SP',
    balance: 20
  }
};
