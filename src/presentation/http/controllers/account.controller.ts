import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put
} from '@nestjs/common';
import { ICreateAccountUsecases } from 'src/domain/protocols/usecases/account/createAccount.usecases.interface';
import { IShowAccountUsecases } from 'src/domain/protocols/usecases/account/showAccount.usecases.interface';
import { IUpdateAccountUsecases } from 'src/domain/protocols/usecases/account/updateAccount.usecases.interface';
import { CreateAccountDto, UpdateAccountDto } from '../dtos/account.dto';

@Controller('account')
export class AccountController {
  constructor(
    @Inject('CreateAccountUseCases')
    private readonly createAccountUsecases: ICreateAccountUsecases,
    @Inject('ShowAccountUseCases')
    private readonly showAccountUsecases: IShowAccountUsecases,
    @Inject('UpdateAccountUseCases')
    private readonly UpdateAccountUsecases: IUpdateAccountUsecases
  ) {}

  @Post('/')
  async createAccount(
    @Body() { name, document, email, telephone, address }: CreateAccountDto
  ) {
    const accountCreated = await this.createAccountUsecases.execute(
      name,
      document,
      email,
      telephone,
      address
    );
    return accountCreated;
  }
  @Get('/:id')
  async getAccount(@Param('id', ParseIntPipe) id: number) {
    const account = await this.showAccountUsecases.execute(id);
    return account;
  }
  @Put('/:id')
  async updateAccount(
    @Param('id', ParseIntPipe) id: number,
    @Body() { name, email, telephone, address }: UpdateAccountDto
  ) {
    const account = await this.UpdateAccountUsecases.execute(id, {
      name,
      email,
      telephone,
      address
    });
    return account;
  }
  @Delete('/:id')
  async deleteAccount(@Param('id', ParseIntPipe) id: number) {
    const account = await this.UpdateAccountUsecases.execute(id, {});
    return account;
  }
}
