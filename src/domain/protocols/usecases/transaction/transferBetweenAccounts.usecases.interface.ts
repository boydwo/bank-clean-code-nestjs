import { IStatementResponse } from './response/response.usecases.interface';

export interface ITransferBetweenAccountsUsecases {
  execute(
    sender_account_id: number,
    receiver_account_id: number,
    value: number,
  ): Promise<IStatementResponse>;
}
