/*
  Warnings:

  - You are about to drop the column `income` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `sourceOfIncome` on the `User` table. All the data in the column will be lost.
  - The `maritalStatus` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `education` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `taxResidency` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "EducationLevel" AS ENUM ('UNDERGRADUATE', 'GRADUATE', 'POST_GRADUATE', 'DOCTORATE', 'OTHER');

-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED', 'OTHER');

-- CreateEnum
CREATE TYPE "AnnualIncome" AS ENUM ('BELOW_2_LAKH', 'TWO_TO_FIVE_LAKH', 'FIVE_TO_TEN_LAKH', 'TEN_TO_TWENTYFIVE_LAKH', 'ABOVE_25_LAKH', 'OTHER');

-- CreateEnum
CREATE TYPE "IncomeSource" AS ENUM ('SALARIED', 'SELF_EMPLOYED', 'BUSINESS_OWNER', 'STUDENT', 'RETIRED', 'OTHER');

-- CreateEnum
CREATE TYPE "TaxResidency" AS ENUM ('INDIA', 'NRI', 'FOREIGN_NATIONAL');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "income",
DROP COLUMN "sourceOfIncome",
ADD COLUMN     "annualIncome" "AnnualIncome",
ADD COLUMN     "incomeSource" "IncomeSource",
DROP COLUMN "maritalStatus",
ADD COLUMN     "maritalStatus" "MaritalStatus",
DROP COLUMN "education",
ADD COLUMN     "education" "EducationLevel",
DROP COLUMN "taxResidency",
ADD COLUMN     "taxResidency" "TaxResidency";
