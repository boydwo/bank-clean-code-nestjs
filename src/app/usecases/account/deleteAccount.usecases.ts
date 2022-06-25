import { Injectable } from '@nestjs/common';
import { ILogger } from 'src/domain/protocols/logger/logger.interface';
import { IAccountRepository } from 'src/domain/protocols/repositories/account.repository.interface';

@Injectable()
export class DeleteAccountUseCases {
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
