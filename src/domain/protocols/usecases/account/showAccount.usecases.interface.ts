import { AccountModel } from 'src/domain/models/account.model';

export interface IShowAccountUsecases {
  execute(id: number): Promise<AccountModel>;
}
