import { AccountModel } from 'src/domain/models/account.model';

export type dataUpdateAccount = {
  name?: string;
  email?: string;
  telephone?: string;
  address?: string;
  balance?: number;
};

export interface IUpdateAccountUsecases {
  execute(id: number, account: dataUpdateAccount): Promise<AccountModel>;
}
