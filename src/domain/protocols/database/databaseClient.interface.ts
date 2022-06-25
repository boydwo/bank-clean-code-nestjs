export interface IDatabaseClient {
  create(data: any): Promise<any>;
  findAll(): Promise<any[]>;
  findBy(data: number): Promise<any>;
  update(data: any): Promise<void>;
  delete(data: any): Promise<void>;
  save(data: any): Promise<void>;
}
