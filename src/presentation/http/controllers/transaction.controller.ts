import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post
} from '@nestjs/common';
import { IGetBalanceAccountUsecases } from 'src/domain/protocols/usecases/transaction/geBalanceAccount.usecases';
import { IMakeDepositAccountUsecases } from 'src/domain/protocols/usecases/transaction/makeDepositAccount.usecases.interface';
import { IMakeWithdrawalUsecases } from 'src/domain/protocols/usecases/transaction/makeWithdrawalAccount.usecases.interface';
import { ITransferBetweenAccountsUsecases } from 'src/domain/protocols/usecases/transaction/transferBetweenAccounts.usecases.interface';
import {
  makeDepositAccountDto,
  makeWithdrawalAccountDto,
  transferBetweenAccountsDto
} from '../dtos/transaction.dto';

@Controller('transaction')
export class TransactionController {
  constructor(
    @Inject('MakeDepositAccountUseCases')
    private readonly makeDepositAccountUsecases: IMakeDepositAccountUsecases,
    @Inject('GetBalanceAccountUsecases')
    private readonly getBalanceAccountUseCases: IGetBalanceAccountUsecases,
    @Inject('MakeWithdrawalAccountUsecases')
    private readonly makeWithdrawalAccountUsecases: IMakeWithdrawalUsecases,
    @Inject('TransferBetweenAccountsUsecases')
    private readonly transferBetweenAccountsUsecases: ITransferBetweenAccountsUsecases,
    @Inject('GetStatementAccountUsecases')
    private readonly getStatementAccountUsecases: IGetBalanceAccountUsecases
  ) {}

  @Post('/deposit')
  async makeDepositAccount(
    @Body() { account_id, value }: makeDepositAccountDto
  ) {
    const transaction = await this.makeDepositAccountUsecases.execute(
      account_id,
      value
    );
    return transaction;
  }
  @Get('/balance/:id')
  async getBalanceAccount(@Param('id', ParseIntPipe) account_id: number) {
    const transaction = await this.getBalanceAccountUseCases.execute(
      account_id
    );
    return transaction;
  }
  @Post('/withdrawal')
  async makeWithdrawalAccount(
    @Body() { account_id, value }: makeWithdrawalAccountDto
  ) {
    const transaction = await this.makeWithdrawalAccountUsecases.execute(
      account_id,
      value
    );
    return transaction;
  }

  @Post('/transfer')
  async transferBetweenAccounts(
    @Body()
    {
      sender_account_id,
      receiver_account_id,
      value
    }: transferBetweenAccountsDto
  ) {
    const transaction = await this.transferBetweenAccountsUsecases.execute(
      sender_account_id,
      receiver_account_id,
      value
    );
    return transaction;
  }
  @Get('/statement/:id')
  async statementAccount(@Param('id', ParseIntPipe) account_id: number) {
    const transaction = await this.getStatementAccountUsecases.execute(
      account_id
    );
    return transaction;
  }
}
