/*
  Warnings:

  - You are about to drop the `Athlete` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Official` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TestResult` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."Sport" AS ENUM ('ARCHERY', 'ATHLETICS', 'BOXING', 'CYCLING', 'FENCING', 'HOCKEY', 'JUDO', 'ROWING', 'SWIMMING', 'SHOOTING', 'TABLE_TENNIS', 'WEIGHTLIFTING', 'WRESTLING');

-- DropForeignKey
ALTER TABLE "public"."Session" DROP CONSTRAINT "Session_athleteId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TestResult" DROP CONSTRAINT "TestResult_sessionId_fkey";

-- DropTable
DROP TABLE "public"."Athlete";

-- DropTable
DROP TABLE "public"."Official";

-- DropTable
DROP TABLE "public"."Session";

-- DropTable
DROP TABLE "public"."TestResult";

-- CreateTable
CREATE TABLE "public"."athletes" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" "public"."Gender" NOT NULL,
    "sport" "public"."Sport" NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "athletes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."officials" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "gender" "public"."Gender" NOT NULL,
    "sport" "public"."Sport" NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "officials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."standardized_tests" (
    "id" TEXT NOT NULL,
    "athleteId" TEXT NOT NULL,
    "testDate" TIMESTAMP(3) NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "sitAndReach" JSONB NOT NULL,
    "standingVerticalJump" JSONB NOT NULL,
    "standingBroadJump" JSONB NOT NULL,
    "medicineBallThrow" JSONB NOT NULL,
    "sprint30m" JSONB NOT NULL,
    "shuttleRun4x10m" JSONB NOT NULL,
    "situps" JSONB NOT NULL,
    "run800m" JSONB,
    "run1600m" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "standardized_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."psychological_assessments" (
    "id" TEXT NOT NULL,
    "athleteId" TEXT NOT NULL,
    "assessmentDate" TIMESTAMP(3) NOT NULL,
    "mentalToughness" JSONB NOT NULL,
    "competitiveAnxiety" JSONB NOT NULL,
    "teamCohesion" JSONB NOT NULL,
    "mentalHealth" JSONB NOT NULL,
    "personalityTraits" JSONB NOT NULL,
    "motivationGoals" JSONB NOT NULL,
    "stressCoping" JSONB NOT NULL,
    "healthScreening" JSONB NOT NULL,
    "imageryAbility" JSONB NOT NULL,
    "reactionTime" JSONB NOT NULL,
    "determination" JSONB NOT NULL,
    "timeAnticipation" JSONB NOT NULL,
    "peripheralVision" JSONB NOT NULL,
    "attentionAlertness" JSONB NOT NULL,
    "sensorimotorTasks" JSONB NOT NULL,
    "balanceTests" JSONB NOT NULL,
    "psychomotorTasks" JSONB NOT NULL,
    "cognitiveTasks" JSONB NOT NULL,
    "performanceConsistency" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "psychological_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."swimming_tests" (
    "id" TEXT NOT NULL,
    "athleteId" TEXT NOT NULL,
    "testDate" TIMESTAMP(3) NOT NULL,
    "testResults" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "swimming_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."table_tennis_tests" (
    "id" TEXT NOT NULL,
    "athleteId" TEXT NOT NULL,
    "testDate" TIMESTAMP(3) NOT NULL,
    "testResults" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "table_tennis_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."archery_tests" (
    "id" TEXT NOT NULL,
    "athleteId" TEXT NOT NULL,
    "testDate" TIMESTAMP(3) NOT NULL,
    "testResults" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "archery_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."athletics_tests" (
    "id" TEXT NOT NULL,
    "athleteId" TEXT NOT NULL,
    "testDate" TIMESTAMP(3) NOT NULL,
    "testResults" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "athletics_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."boxing_tests" (
    "id" TEXT NOT NULL,
    "athleteId" TEXT NOT NULL,
    "testDate" TIMESTAMP(3) NOT NULL,
    "testResults" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "boxing_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cycling_tests" (
    "id" TEXT NOT NULL,
    "athleteId" TEXT NOT NULL,
    "testDate" TIMESTAMP(3) NOT NULL,
    "testResults" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cycling_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."fencing_tests" (
    "id" TEXT NOT NULL,
    "athleteId" TEXT NOT NULL,
    "testDate" TIMESTAMP(3) NOT NULL,
    "testResults" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fencing_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."hockey_tests" (
    "id" TEXT NOT NULL,
    "athleteId" TEXT NOT NULL,
    "testDate" TIMESTAMP(3) NOT NULL,
    "testResults" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hockey_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."judo_tests" (
    "id" TEXT NOT NULL,
    "athleteId" TEXT NOT NULL,
    "testDate" TIMESTAMP(3) NOT NULL,
    "testResults" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "judo_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."rowing_tests" (
    "id" TEXT NOT NULL,
    "athleteId" TEXT NOT NULL,
    "testDate" TIMESTAMP(3) NOT NULL,
    "testResults" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rowing_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."shooting_tests" (
    "id" TEXT NOT NULL,
    "athleteId" TEXT NOT NULL,
    "testDate" TIMESTAMP(3) NOT NULL,
    "testResults" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shooting_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."weightlifting_tests" (
    "id" TEXT NOT NULL,
    "athleteId" TEXT NOT NULL,
    "testDate" TIMESTAMP(3) NOT NULL,
    "testResults" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "weightlifting_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."wrestling_tests" (
    "id" TEXT NOT NULL,
    "athleteId" TEXT NOT NULL,
    "testDate" TIMESTAMP(3) NOT NULL,
    "testResults" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wrestling_tests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "athletes_email_key" ON "public"."athletes"("email");

-- CreateIndex
CREATE UNIQUE INDEX "athletes_phone_key" ON "public"."athletes"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "officials_email_key" ON "public"."officials"("email");

-- CreateIndex
CREATE UNIQUE INDEX "officials_phone_key" ON "public"."officials"("phone");

-- CreateIndex
CREATE INDEX "standardized_tests_athleteId_testDate_idx" ON "public"."standardized_tests"("athleteId", "testDate");

-- CreateIndex
CREATE INDEX "standardized_tests_testDate_idx" ON "public"."standardized_tests"("testDate");

-- CreateIndex
CREATE INDEX "psychological_assessments_athleteId_assessmentDate_idx" ON "public"."psychological_assessments"("athleteId", "assessmentDate");

-- CreateIndex
CREATE INDEX "psychological_assessments_assessmentDate_idx" ON "public"."psychological_assessments"("assessmentDate");

-- CreateIndex
CREATE INDEX "swimming_tests_athleteId_testDate_idx" ON "public"."swimming_tests"("athleteId", "testDate");

-- CreateIndex
CREATE INDEX "swimming_tests_testDate_idx" ON "public"."swimming_tests"("testDate");

-- CreateIndex
CREATE INDEX "table_tennis_tests_athleteId_testDate_idx" ON "public"."table_tennis_tests"("athleteId", "testDate");

-- CreateIndex
CREATE INDEX "table_tennis_tests_testDate_idx" ON "public"."table_tennis_tests"("testDate");

-- CreateIndex
CREATE INDEX "archery_tests_athleteId_testDate_idx" ON "public"."archery_tests"("athleteId", "testDate");

-- CreateIndex
CREATE INDEX "archery_tests_testDate_idx" ON "public"."archery_tests"("testDate");

-- CreateIndex
CREATE INDEX "athletics_tests_athleteId_testDate_idx" ON "public"."athletics_tests"("athleteId", "testDate");

-- CreateIndex
CREATE INDEX "athletics_tests_testDate_idx" ON "public"."athletics_tests"("testDate");

-- CreateIndex
CREATE INDEX "boxing_tests_athleteId_testDate_idx" ON "public"."boxing_tests"("athleteId", "testDate");

-- CreateIndex
CREATE INDEX "boxing_tests_testDate_idx" ON "public"."boxing_tests"("testDate");

-- CreateIndex
CREATE INDEX "cycling_tests_athleteId_testDate_idx" ON "public"."cycling_tests"("athleteId", "testDate");

-- CreateIndex
CREATE INDEX "cycling_tests_testDate_idx" ON "public"."cycling_tests"("testDate");

-- CreateIndex
CREATE INDEX "fencing_tests_athleteId_testDate_idx" ON "public"."fencing_tests"("athleteId", "testDate");

-- CreateIndex
CREATE INDEX "fencing_tests_testDate_idx" ON "public"."fencing_tests"("testDate");

-- CreateIndex
CREATE INDEX "hockey_tests_athleteId_testDate_idx" ON "public"."hockey_tests"("athleteId", "testDate");

-- CreateIndex
CREATE INDEX "hockey_tests_testDate_idx" ON "public"."hockey_tests"("testDate");

-- CreateIndex
CREATE INDEX "judo_tests_athleteId_testDate_idx" ON "public"."judo_tests"("athleteId", "testDate");

-- CreateIndex
CREATE INDEX "judo_tests_testDate_idx" ON "public"."judo_tests"("testDate");

-- CreateIndex
CREATE INDEX "rowing_tests_athleteId_testDate_idx" ON "public"."rowing_tests"("athleteId", "testDate");

-- CreateIndex
CREATE INDEX "rowing_tests_testDate_idx" ON "public"."rowing_tests"("testDate");

-- CreateIndex
CREATE INDEX "shooting_tests_athleteId_testDate_idx" ON "public"."shooting_tests"("athleteId", "testDate");

-- CreateIndex
CREATE INDEX "shooting_tests_testDate_idx" ON "public"."shooting_tests"("testDate");

-- CreateIndex
CREATE INDEX "weightlifting_tests_athleteId_testDate_idx" ON "public"."weightlifting_tests"("athleteId", "testDate");

-- CreateIndex
CREATE INDEX "weightlifting_tests_testDate_idx" ON "public"."weightlifting_tests"("testDate");

-- CreateIndex
CREATE INDEX "wrestling_tests_athleteId_testDate_idx" ON "public"."wrestling_tests"("athleteId", "testDate");

-- CreateIndex
CREATE INDEX "wrestling_tests_testDate_idx" ON "public"."wrestling_tests"("testDate");

-- AddForeignKey
ALTER TABLE "public"."standardized_tests" ADD CONSTRAINT "standardized_tests_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "public"."athletes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."psychological_assessments" ADD CONSTRAINT "psychological_assessments_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "public"."athletes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."swimming_tests" ADD CONSTRAINT "swimming_tests_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "public"."athletes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."table_tennis_tests" ADD CONSTRAINT "table_tennis_tests_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "public"."athletes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."archery_tests" ADD CONSTRAINT "archery_tests_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "public"."athletes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."athletics_tests" ADD CONSTRAINT "athletics_tests_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "public"."athletes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."boxing_tests" ADD CONSTRAINT "boxing_tests_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "public"."athletes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cycling_tests" ADD CONSTRAINT "cycling_tests_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "public"."athletes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."fencing_tests" ADD CONSTRAINT "fencing_tests_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "public"."athletes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."hockey_tests" ADD CONSTRAINT "hockey_tests_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "public"."athletes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."judo_tests" ADD CONSTRAINT "judo_tests_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "public"."athletes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."rowing_tests" ADD CONSTRAINT "rowing_tests_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "public"."athletes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."shooting_tests" ADD CONSTRAINT "shooting_tests_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "public"."athletes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."weightlifting_tests" ADD CONSTRAINT "weightlifting_tests_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "public"."athletes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."wrestling_tests" ADD CONSTRAINT "wrestling_tests_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "public"."athletes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
