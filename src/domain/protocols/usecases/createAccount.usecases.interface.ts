import { AccountModel } from '../../models/account.model';

export interface ICreateAccountUsecases {
  execute(
    name: string,
    document: string,
    email: string,
    telephone: string,
    address: string,
  ): Promise<AccountModel>;
}
