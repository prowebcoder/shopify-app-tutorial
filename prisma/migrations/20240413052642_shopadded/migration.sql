/*
  Warnings:

  - A unique constraint covering the columns `[shop]` on the table `Settings` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Settings" ADD COLUMN "shop" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Settings_shop_key" ON "Settings"("shop");
