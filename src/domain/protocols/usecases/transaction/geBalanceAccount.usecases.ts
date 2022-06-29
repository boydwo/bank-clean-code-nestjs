export type GetBalanceResponse = {
  id: number;
  name: string;
  balance: number;
  message: string;
};

export interface IGetBalanceAccountUsecases {
  execute(account_id: number, value: number): Promise<GetBalanceResponse>;
}
