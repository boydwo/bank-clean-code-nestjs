import { ILogger } from 'src/domain/protocols/logger/logger.interface';
import { IAccountRepository } from 'src/domain/protocols/repositories/account.repository.interface';
import { IDeleteAccountUsecases } from 'src/domain/protocols/usecases/account/deleteAccount.usecases.interface';

export class DeleteAccountUseCases implements IDeleteAccountUsecases {
  constructor(
    private readonly accountRepository: IAccountRepository,
    private readonly logger: ILogger,
  ) {}

  async execute(id: number): Promise<void> {
    await this.accountRepository.deleteById(id);

    this.logger.info(
      'DeleteAccountUseCases.execute',
      `Account ID:${id} has been deleted`,
    );
  }
}
