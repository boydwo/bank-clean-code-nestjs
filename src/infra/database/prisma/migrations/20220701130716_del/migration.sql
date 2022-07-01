-- DropForeignKey
ALTER TABLE "transaction_accounts" DROP CONSTRAINT "transaction_accounts_account_id_fkey";

-- AddForeignKey
ALTER TABLE "transaction_accounts" ADD CONSTRAINT "transaction_accounts_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
