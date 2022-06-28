import { roleTransactionsEnum } from 'src/domain/enum/roleTransactions.enum';
import { typeTransactionsEnum } from 'src/domain/enum/typeTransactions.enum';
import { AccountModel } from 'src/domain/models/account.model';
import { TransactionModel } from 'src/domain/models/transaction.model';
import { IException } from 'src/domain/protocols/exceptions/exceptions.interface';
import { ILogger } from 'src/domain/protocols/logger/logger.interface';
import { IAccountRepository } from 'src/domain/protocols/repositories/account.repository.interface';
import { ITransactionRepository } from 'src/domain/protocols/repositories/transaction.repository.interface';
import { ITransactionAccountRepository } from 'src/domain/protocols/repositories/transactionAccount.repository.interface';
import { IStatementResponse } from 'src/domain/protocols/usecases/transaction/response/response.usecases.interface';
import { ITransferBetweenAccountsUsecases } from 'src/domain/protocols/usecases/transaction/transferBetweenAccounts.usecases.interface';

export class TransferBetweenAccountsUsecases
  implements ITransferBetweenAccountsUsecases
{
  constructor(
    private readonly accountRepository: IAccountRepository,
    private readonly transactionRepository: ITransactionRepository,
    private readonly transactionAccountRepository: ITransactionAccountRepository,
    private readonly exception: IException,
    private readonly logger: ILogger,
  ) {}

  async execute(
    sender_account_id: number,
    receiver_account_id: number,
    value: number,
  ): Promise<IStatementResponse> {
    const isSameAccount = sender_account_id === receiver_account_id;

    if (isSameAccount) {
      throw this.exception.badRequest({
        message: 'Invalid Transfer Operation!',
      });
    }

    const existsSenderAccount = await this.accountRepository.findById(
      sender_account_id,
    );

    if (!existsSenderAccount) {
      throw this.exception.notFound({
        message: 'Sender account not found!',
      });
    }
    const existsReceiverAccount = await this.accountRepository.findById(
      receiver_account_id,
    );

    if (!existsReceiverAccount) {
      throw this.exception.notFound({
        message: 'Receiver account not found!',
      });
    }

    const senderHaveBalance = existsSenderAccount.balance >= value;

    if (!senderHaveBalance) {
      throw this.exception.badRequest({
        message: 'Transaction error! Your balance is insufficient!',
      });
    }

    const type = typeTransactionsEnum.TRANSFER;

    const transactionCreated = await this.transactionRepository.create(
      type,
      value,
    );

    const senderRole = roleTransactionsEnum.SUBTRACT;

    const { before_balance, after_balance } =
      await this.calculatesBalanceAccount(
        existsSenderAccount,
        transactionCreated,
        value,
        senderRole,
      );

    await this.calculatesBalanceAccount(
      existsReceiverAccount,
      transactionCreated,
      value,
      roleTransactionsEnum.ADD,
    );

    this.logger.info(
      'TransferBetweenAccountsUsecases.execute',
      `Account id:${sender_account_id} transferred R$${value} to Account id:${receiver_account_id}`,
    );

    return {
      account_id: sender_account_id,
      value,
      role: senderRole,
      type,
      before_balance,
      after_balance,
      transaction_id: transactionCreated.id,
      receiver_account_id,
    };
  }

  private async calculatesBalanceAccount(
    account: AccountModel,
    transactionCreated: TransactionModel,
    value: number,
    role: roleTransactionsEnum,
  ) {
    const before_balance = account.balance;

    const operation = {
      [roleTransactionsEnum.ADD]: before_balance + value,
      [roleTransactionsEnum.SUBTRACT]: before_balance - value,
    };

    const after_balance = operation[role];

    await this.transactionAccountRepository.create(
      account.id,
      transactionCreated.id,
      role,
      value,
      before_balance,
      after_balance,
    );

    await this.accountRepository.update(account.id, {
      balance: after_balance,
    });

    return { before_balance, after_balance };
  }
}
