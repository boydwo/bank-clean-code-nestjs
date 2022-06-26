import { typeTransactionsEnum } from 'src/domain/enum/typeTransactions.enum';
import { TransactionModel } from 'src/domain/models/transaction.model';

export interface ITransactionRepository {
  create(type: typeTransactionsEnum, value: number): Promise<TransactionModel>;
  findById(id: number): Promise<TransactionModel[]>;
}
