import { IException } from 'src/domain/protocols/exceptions/exceptions.interface';
import { IAccountRepository } from 'src/domain/protocols/repositories/account.repository.interface';
import {
  GetBalanceResponse,
  IGetBalanceAccountUsecases
} from 'src/domain/protocols/usecases/transaction/geBalanceAccount.usecases';

export class GetBalanceAccountUsecases implements IGetBalanceAccountUsecases {
  constructor(
    private readonly accountRepository: IAccountRepository,
    private readonly exception: IException,
  ) {}

  async execute(id: number): Promise<GetBalanceResponse> {
    const existsAccount = await this.accountRepository.findById(id);

    if (!existsAccount) {
      throw this.exception.notFound({
        message: 'Account not found!',
      });
    }

    return {
      id: existsAccount.id,
      name: existsAccount.name,
      balance: existsAccount.balance,
      message: `${existsAccount.name} you have R$${existsAccount.balance} in your account`,
    };
  }
}
