/*
  Warnings:

  - You are about to drop the column `description` on the `Ad` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Ad_description_key";

-- AlterTable
ALTER TABLE "Ad" DROP COLUMN "description";
