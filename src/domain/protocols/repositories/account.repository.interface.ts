import { AccountModel } from '../../models/account.model';
import { dataUpdateAccount } from '../usecases/account/updateAccount.usecases.interface';

export interface IAccountRepository {
  create(
    name: string,
    document: string,
    email: string,
    telephone: string,
    address: string,
  ): Promise<AccountModel>;
  findAll(): Promise<AccountModel[]>;
  findById(id: number): Promise<AccountModel>;
  findByDocument(document: string): Promise<AccountModel>;
  update(id: number, account: dataUpdateAccount): Promise<AccountModel>;
  deleteById(id: number): Promise<void>;
}
