import { roleTransactionsEnum } from 'src/domain/enum/roleTransactions.enum';
import { typeTransactionsEnum } from 'src/domain/enum/typeTransactions.enum';
import { TransactionModel } from 'src/domain/models/transaction.model';
import { IException } from 'src/domain/protocols/exceptions/exceptions.interface';
import { IAccountRepository } from 'src/domain/protocols/repositories/account.repository.interface';
import { ITransactionAccountRepository } from 'src/domain/protocols/repositories/transactionAccount.repository.interface';
import {
  GetStatementResponse,
  IGetStatementAccountUsecases
} from 'src/domain/protocols/usecases/transaction/getStatementAccount.usecases.interface';

export class GetStatementAccountUsecases
  implements IGetStatementAccountUsecases
{
  constructor(
    private readonly accountRepository: IAccountRepository,
    private readonly transactionAccountRepository: ITransactionAccountRepository,
    private readonly exception: IException
  ) {}

  async execute(id: number): Promise<GetStatementResponse[]> {
    const existsAccount = await this.accountRepository.findById(id);

    if (!existsAccount) {
      throw this.exception.notFound({
        message: 'Account not found!'
      });
    }

    const transactions =
      await this.transactionAccountRepository.findAllByAccountIdWithTransactionAndAccounts(
        id
      );

    const response = transactions.map(
      ({ transaction, role, account_id, value }) => {
        const date = new Date(transaction.createdAt);
        const data: GetStatementResponse = {
          account_transaction_id: account_id,
          role,
          type: transaction.type,
          value,
          created_at: transaction.createdAt,
          transaction_id: transaction.id,
          message: `You made ${
            transaction.type
          } and ${role} R$${value} in your account in ${date.getDate()}-${
            date.getMonth() + 1
          }-${date.getFullYear()}`
        };

        this.verifyIfTransactionIsTransferBetweenAccounts(
          transaction,
          account_id,
          role,
          data
        );

        return data;
      }
    );
    return response;
  }

  private verifyIfTransactionIsTransferBetweenAccounts(
    transaction: TransactionModel,
    account_id: number,
    role: roleTransactionsEnum,
    data: GetStatementResponse
  ) {
    if (transaction.type === typeTransactionsEnum.TRANSFER) {
      const otherAccount = transaction.transaction_accounts.find(
        (trasAcc) => trasAcc.account_id !== account_id
      );

      if (role === roleTransactionsEnum.SUBTRACT) {
        data.message = data.message + ` to ${otherAccount.account.name}`;
        data.receiver_account_id = otherAccount.account_id;
      } else {
        data.message = data.message + ` from ${otherAccount.account.name}`;
        data.sender_account_id = otherAccount.account_id;
      }
    }
    return;
  }
}
