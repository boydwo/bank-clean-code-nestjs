import { AccountModel } from 'src/domain/models/account.model';
import { IException } from 'src/domain/protocols/exceptions/exceptions.interface';
import { IAccountRepository } from 'src/domain/protocols/repositories/account.repository.interface';
import { IShowAccountUsecases } from 'src/domain/protocols/usecases/account/showAccount.usecases.interface';

export class ShowAccountUseCases implements IShowAccountUsecases {
  constructor(
    private readonly accountRepository: IAccountRepository,
    private readonly exception: IException,
  ) {}

  async execute(id: number): Promise<AccountModel> {
    const existsAccount = await this.accountRepository.findById(id);

    if (!existsAccount) {
      throw this.exception.notFound({
        message: 'Account not found!',
      });
    }

    return existsAccount;
  }
}
