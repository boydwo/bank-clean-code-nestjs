import { AccountModel } from 'src/domain/models/account.model';
import { IException } from 'src/domain/protocols/exceptions/exceptions.interface';
import { ILogger } from 'src/domain/protocols/logger/logger.interface';
import { IAccountRepository } from 'src/domain/protocols/repositories/account.repository.interface';
import { ICreateAccountUsecases } from 'src/domain/protocols/usecases/createAccount.usecases.interface';

export class CreateAccountUseCases implements ICreateAccountUsecases {
  constructor(
    private readonly accountRepository: IAccountRepository,
    private readonly exception: IException,
    private readonly logger: ILogger,
  ) {}

  async execute(
    name: string,
    document: string,
    email: string,
    telephone: string,
    address: string,
  ): Promise<AccountModel> {
    const existsAccount = await this.accountRepository.findByDocument(document);

    if (existsAccount) {
      throw this.exception.badRequest({
        message: 'Account already exists!',
      });
    }

    const accountCreated: AccountModel = await this.accountRepository.create(
      name,
      document,
      email,
      telephone,
      address,
    );

    this.logger.info(
      'createAccountUseCases.execute',
      `Account ${name} created successfully`,
    );

    return accountCreated;
  }
}
