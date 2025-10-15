-- CreateEnum
CREATE TYPE "KycStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "InvestmentType" AS ENUM ('SIP', 'LUMPSUM');

-- CreateEnum
CREATE TYPE "SIPFrequency" AS ENUM ('MONTHLY', 'QUARTERLY', 'WEEKLY');

-- CreateEnum
CREATE TYPE "SIPStatus" AS ENUM ('ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('INITIATED', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "PaymentMode" AS ENUM ('UPI', 'NETBANKING', 'AUTO_DEBIT');

-- CreateEnum
CREATE TYPE "InvestmentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'REDEEMED', 'CANCELLED', 'ONGOING');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "encryptedPan" TEXT NOT NULL,
    "encryptedBankAcc" TEXT,
    "encryptedIfsc" TEXT,
    "upiId" TEXT,
    "dob" TIMESTAMP(3),
    "maritalStatus" TEXT,
    "education" TEXT,
    "motherName" TEXT,
    "fatherName" TEXT,
    "income" DOUBLE PRECISION,
    "sourceOfIncome" TEXT,
    "countryOfBirth" TEXT,
    "nationality" TEXT,
    "taxResidency" JSONB,
    "nomineeName" TEXT,
    "nomineeRelation" TEXT,
    "currentStep" INTEGER NOT NULL DEFAULT 1,
    "kycStatus" "KycStatus" NOT NULL DEFAULT 'PENDING',
    "ckycRefId" TEXT,
    "digilockerToken" TEXT,
    "fatcaDeclaration" JSONB,
    "languagePref" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SIP" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fundName" TEXT NOT NULL,
    "amcCode" TEXT NOT NULL,
    "schemeCode" TEXT NOT NULL,
    "amountPerInstallment" DOUBLE PRECISION NOT NULL,
    "totalInstallments" INTEGER NOT NULL,
    "frequency" "SIPFrequency" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "nextInstallment" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "status" "SIPStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SIP_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Investment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sipId" TEXT,
    "fundName" TEXT NOT NULL,
    "amcCode" TEXT NOT NULL,
    "schemeCode" TEXT NOT NULL,
    "units" DOUBLE PRECISION NOT NULL,
    "navAtPurchase" DOUBLE PRECISION NOT NULL,
    "currentNav" DOUBLE PRECISION,
    "type" "InvestmentType" NOT NULL,
    "status" "InvestmentStatus" NOT NULL,
    "purchaseDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Investment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "investmentId" TEXT,
    "txnRef" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "mode" "PaymentMode" NOT NULL,
    "razorpayOrderId" TEXT,
    "upiRefId" TEXT,
    "status" "PaymentStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "docType" TEXT NOT NULL,
    "s3Url" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- AddForeignKey
ALTER TABLE "SIP" ADD CONSTRAINT "SIP_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_sipId_fkey" FOREIGN KEY ("sipId") REFERENCES "SIP"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_investmentId_fkey" FOREIGN KEY ("investmentId") REFERENCES "Investment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
