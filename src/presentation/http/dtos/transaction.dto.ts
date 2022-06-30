export class makeDepositAccountDto {
  readonly account_id: number;
  readonly value: number;
}
export class makeWithdrawalAccountDto {
  readonly account_id: number;
  readonly value: number;
}
export class transferBetweenAccountsDto {
  readonly sender_account_id: number;
  readonly receiver_account_id: number;
  readonly value: number;
}
