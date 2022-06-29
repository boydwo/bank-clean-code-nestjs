export type GetStatementResponse = {
  transaction_id: number;
  account_transaction_id: number;
  type: string;
  role: string;
  receiver_account_id?: number;
  sender_account_id?: number;
  value: number;
  created_at: string;
};

export interface IGetStatementAccountUsecases {
  execute(account_id: number): Promise<GetStatementResponse[]>;
}
