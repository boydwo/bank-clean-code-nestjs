import { IsNotEmpty, IsNumber } from 'class-validator';

export class makeDepositAccountDto {
  @IsNumber()
  @IsNotEmpty()
  account_id: number;
  @IsNumber()
  @IsNotEmpty()
  value: number;
}
export class makeWithdrawalAccountDto {
  @IsNumber()
  @IsNotEmpty()
  account_id: number;
  @IsNumber()
  @IsNotEmpty()
  value: number;
}
export class transferBetweenAccountsDto {
  @IsNumber()
  @IsNotEmpty()
  sender_account_id: number;
  @IsNumber()
  @IsNotEmpty()
  receiver_account_id: number;
  @IsNumber()
  @IsNotEmpty()
  value: number;
}

export class StatementResponseDto {
  account_id?: number;
  value: number;
  role: string;
  type: string;
  before_balance?: number;
  after_balance?: number;
  transaction_id: number;
  receiver_account_id?: number;
  created_at?: string;
  message?: string;
}
