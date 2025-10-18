-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY');

-- CreateEnum
CREATE TYPE "ResidentialStatus" AS ENUM ('RESIDENT_INDIVIDUAL', 'NRI', 'FOREIGN_NATIONAL');

-- CreateEnum
CREATE TYPE "OccupationType" AS ENUM ('PRIVATE_SECTOR', 'PUBLIC_SECTOR', 'GOVERNMENT_SERVICE', 'BUSINESS', 'PROFESSIONAL', 'STUDENT', 'RETIRED', 'HOUSEWIFE', 'OTHER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "gender" "Gender",
ADD COLUMN     "occupationType" "OccupationType",
ADD COLUMN     "residentialStatus" "ResidentialStatus";
