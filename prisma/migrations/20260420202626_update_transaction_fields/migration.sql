-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "account" TEXT NOT NULL DEFAULT 'Cash',
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING';
