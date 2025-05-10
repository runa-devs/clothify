/*
  Warnings:

  - You are about to drop the column `costumeKey` on the `try_on_jobs` table. All the data in the column will be lost.
  - You are about to drop the column `sourceKey` on the `try_on_jobs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "try_on_jobs" DROP COLUMN "costumeKey",
DROP COLUMN "sourceKey";
