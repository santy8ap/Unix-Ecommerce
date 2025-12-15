/*
  Warnings:

  - The `bestColors` column on the `ColorimetryResult` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `goodColors` column on the `ColorimetryResult` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `avoidColors` column on the `ColorimetryResult` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `recommendations` column on the `ColorimetryResult` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `images` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `sizes` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `colors` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `styleTypes` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `items` on the `Outfit` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "ColorimetryResult" DROP COLUMN "bestColors",
ADD COLUMN     "bestColors" TEXT[],
DROP COLUMN "goodColors",
ADD COLUMN     "goodColors" TEXT[],
DROP COLUMN "avoidColors",
ADD COLUMN     "avoidColors" TEXT[],
DROP COLUMN "recommendations",
ADD COLUMN     "recommendations" JSONB;

-- AlterTable
ALTER TABLE "Outfit" DROP COLUMN "items",
ADD COLUMN     "items" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "images",
ADD COLUMN     "images" TEXT[],
DROP COLUMN "sizes",
ADD COLUMN     "sizes" TEXT[],
DROP COLUMN "colors",
ADD COLUMN     "colors" TEXT[],
DROP COLUMN "styleTypes",
ADD COLUMN     "styleTypes" TEXT[];
