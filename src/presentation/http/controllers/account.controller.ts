import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';
import { ICreateAccountUsecases } from 'src/domain/protocols/usecases/account/createAccount.usecases.interface';
import { IShowAccountUsecases } from 'src/domain/protocols/usecases/account/showAccount.usecases.interface';
import { IUpdateAccountUsecases } from 'src/domain/protocols/usecases/account/updateAccount.usecases.interface';
import {
  AccountResponseDto,
  CreateAccountDto,
  UpdateAccountDto
} from '../dtos/account.dto';

@ApiTags('Account')
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
  @HttpCode(200)
  @ApiOperation({
    summary: 'Create a new Account',
    description: 'This endpoint create a new account in baking system'
  })
  @ApiBody({
    type: CreateAccountDto,
    description: 'Create a new account'
  })
  @ApiBadRequestResponse({
    description: 'Account already exists!'
  })
  async createAccount(
    @Body() account: CreateAccountDto
  ): Promise<AccountResponseDto> {
    const accountCreated = await this.createAccountUsecases.execute(
      account.name,
      account.document,
      account.email,
      account.telephone,
      account.address
    );
    return accountCreated;
  }
  @Get('/:id')
  @ApiOperation({
    summary: 'Show account by Id',
    description: 'This endpoint get a exists account by id in baking system'
  })
  @ApiNotFoundResponse({
    description: 'Account not found!'
  })
  async getAccount(
    @Param('id', ParseIntPipe) id: number
  ): Promise<AccountResponseDto> {
    const account = await this.showAccountUsecases.execute(id);
    return account;
  }
  @Put('/:id')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Update account by Id',
    description: 'This endpoint update a exists account by id in baking system'
  })
  @ApiNotFoundResponse({
    description: 'Account not found!'
  })
  async updateAccount(
    @Param('id', ParseIntPipe) id: number,
    @Body() { name, email, telephone, address }: UpdateAccountDto
  ): Promise<AccountResponseDto> {
    const account = await this.UpdateAccountUsecases.execute(id, {
      name,
      email,
      telephone,
      address
    });
    return account;
  }
  @Delete('/:id')
  @ApiOperation({
    summary: 'Delete account by Id',
    description: 'This endpoint delete a exists account by id in baking system'
  })
  @ApiNotFoundResponse({
    description: 'Account not found!'
  })
  async deleteAccount(@Param('id', ParseIntPipe) id: number) {
    await this.UpdateAccountUsecases.execute(id, {});
    return {
      message: 'Account deleted'
    };
  }
}
