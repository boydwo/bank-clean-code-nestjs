import { roleTransactionsEnum } from 'src/domain/enum/roleTransactions.enum';
import { typeTransactionsEnum } from 'src/domain/enum/typeTransactions.enum';
import { IException } from 'src/domain/protocols/exceptions/exceptions.interface';
import { ILogger } from 'src/domain/protocols/logger/logger.interface';
import { IAccountRepository } from 'src/domain/protocols/repositories/account.repository.interface';
import { ITransactionRepository } from 'src/domain/protocols/repositories/transaction.repository.interface';
import { ITransactionAccountRepository } from 'src/domain/protocols/repositories/transactionAccount.repository.interface';
import {
  IMakeWithdrawalUsecases,
  IWithdrawalResponse
} from 'src/domain/protocols/usecases/makeWithdrawalAccount.usecases.interface';

export class MakeWithdrawalAccountUsecases implements IMakeWithdrawalUsecases {
  constructor(
    private readonly accountRepository: IAccountRepository,
    private readonly transactionRepository: ITransactionRepository,
    private readonly transactionAccountRepository: ITransactionAccountRepository,
    private readonly exception: IException,
    private readonly logger: ILogger,
  ) {}

  async execute(
    account_id: number,
    value: number,
  ): Promise<IWithdrawalResponse> {
    const existsAccount = await this.accountRepository.findById(account_id);

    if (!existsAccount) {
      throw this.exception.notFound({
        message: 'Account not found!',
      });
    }

    const haveBalance = existsAccount.balance >= value;

    if (!haveBalance) {
      throw this.exception.badRequest({
        message: 'Your balance is insufficient!',
      });
    }

    const type = typeTransactionsEnum.WITHDRAWAL;
    const role = roleTransactionsEnum.SUBTRACT;

    const transactionCreated = await this.transactionRepository.create(
      type,
      value,
    );

    const before_balance = existsAccount.balance;
    const after_balance = before_balance - value;

    await this.transactionAccountRepository.create(
      account_id,
      transactionCreated.id,
      role,
      value,
      before_balance,
      after_balance,
    );

    await this.accountRepository.update(existsAccount.id, {
      balance: after_balance,
    });

    this.logger.info(
      'MakeWithdrawalAccountUsecases.execute',
      `Account id:${existsAccount.id} made a withdrawal of R$${value}`,
    );

    return {
      account_id,
      value,
      role,
      type,
      before_balance,
      after_balance,
      transaction_id: transactionCreated.id,
    };
  }
}
