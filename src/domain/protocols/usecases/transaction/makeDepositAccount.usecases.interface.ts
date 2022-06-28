import { IStatementResponse } from './response/response.usecases.interface';

export interface IMakeDepositAccountUsecases {
  execute(account_id: number, value: number): Promise<IStatementResponse>;
}
