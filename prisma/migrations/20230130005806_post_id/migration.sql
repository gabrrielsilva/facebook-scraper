/*
  Warnings:

  - A unique constraint covering the columns `[description]` on the table `Ad` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Ad_description_key" ON "Ad"("description");
