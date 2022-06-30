import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  document: string;
  @IsString()
  telephone?: string;
  @IsString()
  @IsNotEmpty()
  address: string;
}

export class UpdateAccountDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  email: string;
  @IsString()
  telephone?: string;
  @IsString()
  @IsNotEmpty()
  address: string;
}

export class AccountResponseDto {
  id: number;
  name: string;
  email: string;
  document: string;
  telephone?: string;
  address: string;
}
