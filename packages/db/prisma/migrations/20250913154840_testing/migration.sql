/*
  Warnings:

  - You are about to drop the `_AthleteToTestResult` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_AthleteToTestResult" DROP CONSTRAINT "_AthleteToTestResult_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_AthleteToTestResult" DROP CONSTRAINT "_AthleteToTestResult_B_fkey";

-- DropTable
DROP TABLE "public"."_AthleteToTestResult";
