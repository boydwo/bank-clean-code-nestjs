import { IDatabaseClient } from 'src/domain/protocols/database/databaseClient.interface';
import { PrismaServiceClient } from '../prisma.service.client';

export class TransactionPrismaDatabaseAdapter implements IDatabaseClient {
  constructor(private readonly prismaClient: PrismaServiceClient) {}

  async create(data: any) {
    const account = await this.prismaClient.transaction.create({ data });
    return account;
  }
  async findBy(data: any) {
    const account = await this.prismaClient.transaction.findUnique({
      where: data
    });
    return account;
  }
  async findAll() {
    const accounts = await this.prismaClient.transaction.findMany();
    return accounts;
  }

  async findAllWithArgs({ id }) {
    const accounts = await this.prismaClient.transaction.findMany({
      where: {
        id
      }
    });
    return accounts;
  }
  async update({ id, data }) {
    const accounts = await this.prismaClient.transaction.update({
      where: { id: id },
      data
    });

    return accounts;
  }

  async delete(id: number) {
    await this.prismaClient.transaction.delete({
      where: {
        id
      }
    });
  }
}
