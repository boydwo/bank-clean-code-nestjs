import { AccountModel } from 'src/domain/models/account.model';
import { IDatabaseClient } from 'src/domain/protocols/database/databaseClient.interface';
import { IAccountRepository } from 'src/domain/protocols/repositories/account.repository.interface';
import { dataUpdateAccount } from 'src/domain/protocols/usecases/account/updateAccount.usecases.interface';

export class AccountRepository implements IAccountRepository {
  constructor(private readonly database: IDatabaseClient) {}

  async create(
    name: string,
    document: string,
    email: string,
    telephone: string,
    address: string
  ): Promise<AccountModel> {
    const accountCreated = await this.database.create({
      name,
      document,
      email,
      telephone,
      address
    });
    return accountCreated;
  }
  async findAll(): Promise<AccountModel[]> {
    const accounts = await this.database.findAll();
    return accounts;
  }
  async findById(id: number): Promise<AccountModel> {
    const account = await this.database.findBy({ id });
    return account;
  }
  async findByDocument(document: string): Promise<AccountModel> {
    const account = await this.database.findBy({ document });
    return account;
  }
  async update(id: number, account: dataUpdateAccount): Promise<AccountModel> {
    const accountUpdated = await this.database.update({ id, account });
    return accountUpdated;
  }
  async deleteById(id: number): Promise<void> {
    await this.database.delete(id);
  }
}
