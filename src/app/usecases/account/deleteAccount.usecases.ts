import { IException } from 'src/domain/protocols/exceptions/exceptions.interface';
import { ILogger } from 'src/domain/protocols/logger/logger.interface';
import { IAccountRepository } from 'src/domain/protocols/repositories/account.repository.interface';
import { IDeleteAccountUsecases } from 'src/domain/protocols/usecases/account/deleteAccount.usecases.interface';

export class DeleteAccountUseCases implements IDeleteAccountUsecases {
  constructor(
    private readonly accountRepository: IAccountRepository,
    private readonly logger: ILogger,
    private readonly exception: IException
  ) {}

  async execute(id: number): Promise<void> {
    const existsAccount = await this.accountRepository.findById(id);

    if (!existsAccount) {
      throw this.exception.notFound({
        message: 'Account not found!'
      });
    }

    await this.accountRepository.deleteById(id);

    this.logger.info(
      'DeleteAccountUseCases.execute',
      `Account ID:${id} has been deleted`
    );
  }
}
