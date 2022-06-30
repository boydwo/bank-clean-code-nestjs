export class CreateAccountDto {
  readonly name: string;
  readonly email: string;
  readonly document: string;
  readonly telephone?: string;
  readonly address: string;
}
export class UpdateAccountDto {
  readonly name: string;
  readonly email: string;
  readonly telephone?: string;
  readonly address: string;
}
