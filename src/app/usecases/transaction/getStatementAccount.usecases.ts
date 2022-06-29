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
    private readonly exception: IException,
  ) {}

  async execute(id: number): Promise<GetStatementResponse[]> {
    const existsAccount = await this.accountRepository.findById(id);

    if (!existsAccount) {
      throw this.exception.notFound({
        message: 'Account not found!',
      });
    }

    const transactions =
      await this.transactionAccountRepository.findAllByAccountIdWithTransactionAndAccounts(
        id,
      );

    const response = transactions.map(
      ({ transaction, role, account_id, value }) => {
        const data: GetStatementResponse = {
          account_transaction_id: account_id,
          role,
          type: transaction.type,
          value,
          created_at: transaction.created_at,
          transaction_id: transaction.id,
        };

        this.verifyIfTransactionIsTransferBetweenAccounts(
          transaction,
          account_id,
          role,
          data,
        );

        return data;
      },
    );
    return response;
  }

  private verifyIfTransactionIsTransferBetweenAccounts(
    transaction: TransactionModel,
    account_id: number,
    role: roleTransactionsEnum,
    data: GetStatementResponse,
  ) {
    if (transaction.type === typeTransactionsEnum.TRANSFER) {
      const otherAccount = transaction.transactionAccounts.find(
        (trasAcc) => trasAcc.account_id !== account_id,
      );

      if (role === roleTransactionsEnum.SUBTRACT) {
        data.receiver_account_id = otherAccount.account_id;
      } else {
        data.sender_account_id = otherAccount.account_id;
      }
    }
    return;
  }
}
