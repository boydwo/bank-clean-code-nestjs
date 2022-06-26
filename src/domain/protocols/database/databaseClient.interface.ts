export interface IDatabaseClient {
  create(data: any): Promise<any>;
  findAll(): Promise<any[]>;
  findBy(data: any): Promise<any>;
  update(data: any): Promise<any>;
  delete(data: any): Promise<void>;
}
