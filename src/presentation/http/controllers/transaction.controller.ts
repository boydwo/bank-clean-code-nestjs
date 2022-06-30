import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Param,
  ParseIntPipe,
  Post
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';
import { IGetBalanceAccountUsecases } from 'src/domain/protocols/usecases/transaction/geBalanceAccount.usecases';
import { IGetStatementAccountUsecases } from 'src/domain/protocols/usecases/transaction/getStatementAccount.usecases.interface';
import { IMakeDepositAccountUsecases } from 'src/domain/protocols/usecases/transaction/makeDepositAccount.usecases.interface';
import { IMakeWithdrawalUsecases } from 'src/domain/protocols/usecases/transaction/makeWithdrawalAccount.usecases.interface';
import { ITransferBetweenAccountsUsecases } from 'src/domain/protocols/usecases/transaction/transferBetweenAccounts.usecases.interface';
import {
  makeDepositAccountDto,
  makeWithdrawalAccountDto,
  StatementResponseDto,
  transferBetweenAccountsDto
} from '../dtos/transaction.dto';

@ApiTags('Transaction')
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
    private readonly getStatementAccountUsecases: IGetStatementAccountUsecases
  ) {}

  @Post('/deposit')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Make deposit in account',
    description: 'This endpoint make deposit a exists account in baking system'
  })
  @ApiNotFoundResponse({
    description: 'Account not found!'
  })
  async makeDepositAccount(
    @Body() { account_id, value }: makeDepositAccountDto
  ): Promise<StatementResponseDto> {
    const transaction = await this.makeDepositAccountUsecases.execute(
      account_id,
      value
    );
    return transaction;
  }

  @Get('/balance/:id')
  @ApiOperation({
    summary: 'Get balance in account',
    description: 'This endpoint get balance a exists account in baking system'
  })
  @ApiNotFoundResponse({
    description: 'Account not found!'
  })
  async getBalanceAccount(@Param('id', ParseIntPipe) account_id: number) {
    const transaction = await this.getBalanceAccountUseCases.execute(
      account_id
    );
    return transaction;
  }
  @Post('/withdrawal')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Make withdrawal in account',
    description:
      'This endpoint make withdrawal a exists account with balance available in baking system'
  })
  @ApiBadRequestResponse({
    description: 'Your balance is insufficient!'
  })
  @ApiNotFoundResponse({
    description: 'Account not found!'
  })
  async makeWithdrawalAccount(
    @Body() { account_id, value }: makeWithdrawalAccountDto
  ): Promise<StatementResponseDto> {
    const transaction = await this.makeWithdrawalAccountUsecases.execute(
      account_id,
      value
    );
    return transaction;
  }

  @Post('/transfer')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Transfer between accounts',
    description:
      'This endpoint transfer money between exists account with balance available in baking system'
  })
  @ApiBadRequestResponse({
    description: 'Transaction error! Your balance is insufficient!'
  })
  @ApiNotFoundResponse({
    description: 'Sender or Receiver account not found!'
  })
  async transferBetweenAccounts(
    @Body()
    {
      sender_account_id,
      receiver_account_id,
      value
    }: transferBetweenAccountsDto
  ): Promise<StatementResponseDto> {
    const transaction = await this.transferBetweenAccountsUsecases.execute(
      sender_account_id,
      receiver_account_id,
      value
    );
    return transaction;
  }
  @Get('/statement/:id')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get statement account',
    description:
      'This endpoint get statement account with all transactions in baking system'
  })
  @ApiNotFoundResponse({
    description: 'Account not found!'
  })
  async statementAccount(
    @Param('id', ParseIntPipe) account_id: number
  ): Promise<StatementResponseDto[]> {
    const transaction = await this.getStatementAccountUsecases.execute(
      account_id
    );
    return transaction;
  }
}
