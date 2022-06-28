import { AccountModel } from 'src/domain/models/account.model';

export interface ICreateAccountUsecases {
  execute(
    name: string,
    document: string,
    email: string,
    telephone: string,
    address: string,
  ): Promise<AccountModel>;
}
