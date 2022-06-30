import { typeTransactionsEnum } from 'src/domain/enum/typeTransactions.enum';
import { TransactionModel } from 'src/domain/models/transaction.model';
import { IDatabaseClient } from 'src/domain/protocols/database/databaseClient.interface';
import { ITransactionRepository } from 'src/domain/protocols/repositories/transaction.repository.interface';

export class TransactionRepository implements ITransactionRepository {
  constructor(private readonly database: IDatabaseClient) {}

  async create(
    type: typeTransactionsEnum,
    value: number
  ): Promise<TransactionModel> {
    const transaction = await this.database.create({
      type,
      value
    });
    return transaction;
  }

  async findById(id: number): Promise<TransactionModel> {
    const account = await this.database.findBy({ id });
    return account;
  }
}
