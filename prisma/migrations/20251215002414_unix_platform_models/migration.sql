-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "styleTypes" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "skinTone" TEXT,
ADD COLUMN     "styleType" TEXT;

-- CreateTable
CREATE TABLE "Outfit" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "items" TEXT NOT NULL,
    "occasion" TEXT,
    "season" TEXT,
    "aiGenerated" BOOLEAN NOT NULL DEFAULT false,
    "favorite" BOOLEAN NOT NULL DEFAULT false,
    "timesWorn" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Outfit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClosetItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "colors" TEXT,
    "image" TEXT,
    "brand" TEXT,
    "size" TEXT,
    "price" DOUBLE PRECISION,
    "source" TEXT NOT NULL DEFAULT 'user',
    "favorite" BOOLEAN NOT NULL DEFAULT false,
    "timesWorn" INTEGER NOT NULL DEFAULT 0,
    "lastWorn" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClosetItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ColorimetryResult" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "skinTone" TEXT NOT NULL,
    "season" TEXT,
    "undertone" TEXT,
    "bestColors" TEXT NOT NULL,
    "goodColors" TEXT,
    "avoidColors" TEXT,
    "recommendations" TEXT,
    "aiGenerated" BOOLEAN NOT NULL DEFAULT true,
    "confidence" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ColorimetryResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Outfit_userId_idx" ON "Outfit"("userId");

-- CreateIndex
CREATE INDEX "Outfit_occasion_idx" ON "Outfit"("occasion");

-- CreateIndex
CREATE INDEX "Outfit_favorite_idx" ON "Outfit"("favorite");

-- CreateIndex
CREATE INDEX "ClosetItem_userId_idx" ON "ClosetItem"("userId");

-- CreateIndex
CREATE INDEX "ClosetItem_category_idx" ON "ClosetItem"("category");

-- CreateIndex
CREATE INDEX "ClosetItem_source_idx" ON "ClosetItem"("source");

-- CreateIndex
CREATE UNIQUE INDEX "ColorimetryResult_userId_key" ON "ColorimetryResult"("userId");

-- CreateIndex
CREATE INDEX "ColorimetryResult_skinTone_idx" ON "ColorimetryResult"("skinTone");

-- AddForeignKey
ALTER TABLE "Outfit" ADD CONSTRAINT "Outfit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClosetItem" ADD CONSTRAINT "ClosetItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClosetItem" ADD CONSTRAINT "ClosetItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ColorimetryResult" ADD CONSTRAINT "ColorimetryResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
