/*
  Warnings:

  - You are about to drop the `Document` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Document" DROP CONSTRAINT "Document_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "signatureUrl" TEXT;

-- DropTable
DROP TABLE "public"."Document";
