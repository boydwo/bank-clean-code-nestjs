import { IDatabaseClient } from 'src/domain/protocols/database/databaseClient.interface';
import { PrismaServiceClient } from '../prisma.service.client';

export class AccountPrismaDatabaseAdapter implements IDatabaseClient {
  constructor(private readonly prismaClient: PrismaServiceClient) {}

  async create(data: any) {
    const account = await this.prismaClient.account.create({ data });
    return account;
  }
  async findBy(data: any) {
    const account = await this.prismaClient.account.findUnique({
      where: data
    });
    return account;
  }
  async findAll() {
    const accounts = await this.prismaClient.account.findMany();
    return accounts;
  }

  async findAllWithArgs({ id }) {
    const accounts = await this.prismaClient.account.findMany({
      where: {
        id
      }
    });
    return accounts;
  }
  async update({ id, account }) {
    const accounts = await this.prismaClient.account.update({
      where: { id: id },
      data: account
    });

    return accounts;
  }

  async delete(id: number) {
    await this.prismaClient.account.delete({
      where: {
        id
      }
    });
  }
}
