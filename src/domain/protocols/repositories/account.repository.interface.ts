import { AccountModel } from '../../models/account.model';

export interface IAccountRepository {
  create(account: AccountModel): Promise<AccountModel>;
  findAll(): Promise<AccountModel[]>;
  findById(id: number): Promise<AccountModel>;
  findByDocument(document: string): Promise<AccountModel>;
  update(id: number, account: AccountModel): Promise<void>;
  deleteById(id: number): Promise<void>;
}
