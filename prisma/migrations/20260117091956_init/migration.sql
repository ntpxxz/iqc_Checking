-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "receivedAt" TEXT NOT NULL,
    "inspectionType" TEXT NOT NULL,
    "invoice" TEXT NOT NULL,
    "lotNo" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "partName" TEXT NOT NULL,
    "part" TEXT NOT NULL,
    "rev" TEXT NOT NULL,
    "vendor" TEXT NOT NULL,
    "qty" INTEGER NOT NULL,
    "receiver" TEXT NOT NULL,
    "issue" TEXT NOT NULL,
    "timestamp" TEXT NOT NULL,
    "iqcStatus" TEXT NOT NULL,
    "grn" TEXT NOT NULL,
    "mfgDate" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "samplingType" TEXT NOT NULL,
    "totalSampling" INTEGER NOT NULL,
    "aql" TEXT NOT NULL,
    "urgent" BOOLEAN NOT NULL,
    "requirements" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InspectionResult" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "lotIqc" TEXT NOT NULL,
    "partNo" TEXT NOT NULL,
    "supplier" TEXT NOT NULL,
    "shipLot" TEXT NOT NULL,
    "invoiceNo" TEXT NOT NULL,
    "rev" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "judgment" TEXT NOT NULL,
    "actionLot" TEXT NOT NULL,
    "remark" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "inspector" TEXT NOT NULL,
    "qty" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "partName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InspectionResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL,
    "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
    "autoPrintLabel" BOOLEAN NOT NULL DEFAULT false,
    "defaultAql" TEXT NOT NULL DEFAULT '0.65',
    "samplingStandard" TEXT NOT NULL DEFAULT 'ISO 2859-1',
    "language" TEXT NOT NULL DEFAULT 'English',

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);
