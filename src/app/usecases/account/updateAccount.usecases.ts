import { AccountModel } from 'src/domain/models/account.model';
import { IException } from 'src/domain/protocols/exceptions/exceptions.interface';
import { ILogger } from 'src/domain/protocols/logger/logger.interface';
import { IAccountRepository } from 'src/domain/protocols/repositories/account.repository.interface';

type IDataAccount = {
  name?: string;
  email?: string;
  telephone?: string;
  address?: string;
};

export class UpdateAccountUseCases {
  constructor(
    private readonly accountRepository: IAccountRepository,
    private readonly exception: IException,
    private readonly logger: ILogger,
  ) {}

  async execute(id: number, account: IDataAccount): Promise<AccountModel> {
    const existsAccount = await this.accountRepository.findById(id);

    if (!existsAccount) {
      throw this.exception.notFound({
        message: 'Account not found!',
      });
    }

    const updatedAccount = await this.accountRepository.update(id, account);

    this.logger.info(
      'UpdateAccountUseCases.execute',
      `Account ${updatedAccount.name} has been updated`,
    );

    return updatedAccount;
  }
}
