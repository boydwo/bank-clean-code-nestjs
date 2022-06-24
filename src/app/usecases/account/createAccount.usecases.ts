import { Injectable } from '@nestjs/common';
import { AccountModel } from 'src/domain/models/account.model';
import { IException } from 'src/domain/protocols/exceptions/exceptions.interface';
import { IAccountRepository } from 'src/domain/protocols/repositories/account.repository.interface';

@Injectable()
export class CreateAccountUseCases {
  constructor(
    private readonly accountRepository: IAccountRepository,
    private readonly exception: IException,
  ) {}

  async execute(account: AccountModel): Promise<AccountModel> {
    const existsAccount = await this.accountRepository.findByDocument(
      account.document,
    );

    if (existsAccount) {
      this.exception.badRequest({
        message: 'Account already exists!',
      });
    }

    const accountCreated: AccountModel = await this.accountRepository.create(
      account,
    );

    return accountCreated;
  }
}
