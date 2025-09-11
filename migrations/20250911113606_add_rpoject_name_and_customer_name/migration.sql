/*
  Warnings:

  - You are about to drop the column `name` on the `Project` table. All the data in the column will be lost.
  - Added the required column `customer_name` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `project_name` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Project" DROP COLUMN "name",
ADD COLUMN     "customer_name" TEXT NOT NULL,
ADD COLUMN     "project_name" TEXT NOT NULL;
