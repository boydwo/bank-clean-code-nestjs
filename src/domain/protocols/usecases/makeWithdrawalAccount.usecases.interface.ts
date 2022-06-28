import { IStatementResponse } from './response/response.usecases.interface';

export interface IMakeWithdrawalUsecases {
  execute(account_id: number, value: number): Promise<IStatementResponse>;
}
