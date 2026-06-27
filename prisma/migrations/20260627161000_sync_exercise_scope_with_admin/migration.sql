-- CreateEnum
CREATE TYPE "ExerciseScope" AS ENUM ('CATEGORY', 'TOPIC');

-- AlterEnum
ALTER TYPE "AnswerKey" ADD VALUE IF NOT EXISTS 'E';

-- AlterEnum
ALTER TYPE "QuestionType" ADD VALUE IF NOT EXISTS 'TRUE_FALSE';

-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN "scope" "ExerciseScope";

-- Backfill existing exercise rows based on previous TKA-Mudah behavior:
-- exercises without linked material were treated as category-level packages.
UPDATE "Exercise"
SET "scope" = CASE
  WHEN "materialId" IS NULL THEN 'CATEGORY'::"ExerciseScope"
  ELSE 'TOPIC'::"ExerciseScope"
END
WHERE "scope" IS NULL;

-- Enforce non-null with default for future rows.
ALTER TABLE "Exercise"
ALTER COLUMN "scope" SET NOT NULL,
ALTER COLUMN "scope" SET DEFAULT 'TOPIC';
