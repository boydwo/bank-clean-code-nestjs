export interface IDeleteAccountUsecases {
  execute(id: number): Promise<void>;
}
