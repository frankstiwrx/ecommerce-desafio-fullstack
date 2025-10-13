/*
  Warnings:

  - You are about to drop the column `subtotal` on the `OrderItem` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."OrderItem_orderId_idx";

-- AlterTable
ALTER TABLE "public"."OrderItem" DROP COLUMN "subtotal";
