import { IDatabaseClient } from 'src/domain/protocols/database/databaseClient.interface';
import { PrismaServiceClient } from '../prisma.service.client';

export class TransactionAccountPrismaDatabaseAdapter
  implements IDatabaseClient
{
  constructor(private readonly prismaClient: PrismaServiceClient) {}

  async create(data: any) {
    const transaction = await this.prismaClient.transaction_accounts.create({
      data
    });
    return transaction;
  }
  async findBy(data: any) {
    const transaction = await this.prismaClient.transaction_accounts.findUnique(
      {
        where: data
      }
    );
    return transaction;
  }

  async findAll() {
    const transactions =
      await this.prismaClient.transaction_accounts.findMany();
    return transactions;
  }
  async findAllWithArgs({ account_id }) {
    console.log('dsadsa', account_id);
    const transactions = await this.prismaClient.transaction_accounts.findMany({
      where: {
        account_id
      },
      include: {
        account: true,
        transaction: {
          include: {
            transaction_accounts: {
              include: {
                account: true
              }
            }
          }
        }
      }
    });
    return transactions;
  }

  async update({ id, data }) {
    const transaction = await this.prismaClient.transaction_accounts.update({
      where: { id: id },
      data: data
    });

    return transaction;
  }

  async delete(id: number) {
    await this.prismaClient.account.delete({
      where: {
        id
      }
    });
  }
}
