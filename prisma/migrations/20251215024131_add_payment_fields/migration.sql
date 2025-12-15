-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paymentMethod" TEXT NOT NULL DEFAULT 'bitcoin',
ADD COLUMN     "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "shippingPhone" TEXT,
ADD COLUMN     "transactionId" TEXT;
