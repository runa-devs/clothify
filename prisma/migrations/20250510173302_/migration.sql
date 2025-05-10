/*
  Warnings:

  - You are about to drop the column `description` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `items` table. All the data in the column will be lost.
  - Added the required column `goodsDetailId` to the `items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `goodsId` to the `items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image215` to the `items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "items" DROP COLUMN "description",
DROP COLUMN "imageUrl",
ADD COLUMN     "brand" TEXT,
ADD COLUMN     "brandJp" TEXT,
ADD COLUMN     "colorId" INTEGER,
ADD COLUMN     "colorName" TEXT,
ADD COLUMN     "goodsDetailId" INTEGER NOT NULL,
ADD COLUMN     "goodsId" INTEGER NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "image215" TEXT NOT NULL,
ADD COLUMN     "isSoldOut" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "salePrice" TEXT,
ADD COLUMN     "url" TEXT NOT NULL,
ALTER COLUMN "price" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "try_on_jobs" ADD COLUMN     "itemId" TEXT;

-- AddForeignKey
ALTER TABLE "try_on_jobs" ADD CONSTRAINT "try_on_jobs_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE SET NULL ON UPDATE CASCADE;
